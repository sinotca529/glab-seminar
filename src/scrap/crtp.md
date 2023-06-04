---
title: vcall からの脱却 with CRTP + variant
date: 2023-06-04
tag :
    - scrap
---

# vcall からの脱却 with CRTP + variant
**vcall は遅い**。なぜなら vtable を引いて動的ディスパッチしているから。<br>
CRTP と `variant` を使って**できるだけ静的ディスパッチ**すれば速くなる (かも) という話。

[元ネタ](https://gist.github.com/olibre/3d0774df0f7a16e2da10fae2b2f26c4f)

## CRTP : Curiously Recurring Template Pattern
C++ のデザインパターン。

```cpp
template <typename T>
class Base {
  // 小テク : コンストラクタを T にだけ見せる。
  friend T;
  base() = default;

  // 静的なダウンキャスト (RTTI 不要)
  inline T& down_casted() {
    return static_cast<T&>(*this);
  }
};

class Derived: public Base<Derived> {};

// ↓ Bad からは Base<Derived> のコンストラクタが見えないのでコンパイルエラー
class Bad: public Base<Derived> {};
```

利点 :
- ダウンキャストが静的に (コンパイル時に) 可能。
- → vcall なしにポリモーフィズムを実現可能。

欠点 :
- コード複製が起こる。

## `std::variant`
直和型。

```cpp
struct A { void f() {} void g() {} };
struct B { void f() {} void g() {} };
struct C { void f() {} void g() {} };

// A, B, Cのいずれかの型を代入できる型
std::variant<A, B, C> v;
if (cond) v = A{}; else v = B{};

// B型オブジェクトを保持しているか
if (std::holds_alternative<B>(v)) {
  // 保持しているB型オブジェクトを取得
  B &b = std::get<B>(v);
}

// どの型が代入されていたとしても、共通のインタフェースを呼び出す
std::visit([](auto &x) { x.f(); x.g(); }, v);
```

ヘッダを眺める限り、次のような構造になっていそう :
```cpp
struct variantABC {
  int index;
  // index が 0 なら A, 1 なら B, 2 なら C
  union { A a; B b; C c;} data;
}
```

また、アセンブリを眺めた限り `visit` は次のようになっていそう :
```cpp
void _visitor_A(A &a) { a.f(); a.g(); }
void _visitor_B(B &b) { b.f(); b.g(); }
void _visitor_C(C &c) { c.f(); c.g(); }

void *visitor_table = [
  _visitor_A,
  _visitor_B,
  _visitor_C
];

// std::visit([](auto &x) { x.f(); }, v);
visitor_table[v.index](v.data);
```

## Virtual v.s. CRTP + `variant`
### 基底クラスの定義
::: {.flex55}
:::::: {.flex-right}
::::::::: {.sticky}
```cpp
using msg_ty = int;

struct Actor {
  virtual ~Actor() = default;
  virtual void update() = 0;

  void handle_queued_msgs() {
    while (!pending_msgs.empty()) {
      auto msg = std::move(pending_msgs.front());
      pending_msgs.pop();
      // 動的ディスパッチ (VCALL)
      handle_one_msg(std::move(msg));
    }
  }

  void recv_msg(msg_ty &&msg) {
    pending_msgs.emplace(std::forward<msg_ty>(msg));
  }

private:
  std::queue<msg_ty> pending_msgs;
  virtual void handle_one_msg(msg_ty &&msg) = 0;
};
```
:::::::::
::::::
:::::: {.flex-left}
```cpp
using msg_ty = int;

templaet <typename T>
struct Actor {
  void update() { down_casted().update(); }

  void handle_all_msgs() {
    while (!pending_msgs.empty()) {
      auto msg = std::move(pending_msgs.front());
      pending_msgs.pop();
      // 静的ディスパッチ
      handle_one_msg(std::move(msg));
    }
  }

  void recv_msg(msg_ty &&msg) {
    pending_msgs.emplace(std::forward<msg_ty>(msg));
  }

private:
  friend T;
  Actor() = default;

  std::queue<msg_ty> pending_msgs;

  inline T& down_casted() {
    return static_cast<T&>(*this);
  }

  void handle_one_msg(msg_ty &&msg) {
    // 静的ディスパッチ
    down_casted()
      .handle_one_msg(std::forward<msg_ty>(msg));
  }
};
```
::::::
:::

### 子クラスの定義
::: {.flex55}
:::::: {.flex-right}
```cpp
struct A: Actor {
  void update() override { ... }
  void handle_one_msg(msg_ty &&msg) override { ... }
};

struct B: Actor {
  void update() override { ... }
  void handle_one_msg(msg_ty &&msg) override { ... }
};

```
::::::
:::::: {.flex-left}
```cpp
struct A : Actor<A> {
  void update() { ... }

private:
  friend struct Actor<A>;
  void handle_one_msg(msg_ty && msg) { ... }
};

struct B : Actor<B> {
  void update() { ... }

private:
  friend struct Actor<B>;
  void handle_one_msg(msg_ty && msg) { ... }
};

```
::::::
:::

### 使い方1 : 型によらず同じ処理
::: {.flex55}
:::::: {.flex-left}
```cpp
using container_type = std::vector<std::unique_ptr<Actor>>;

for (auto &actor : actors) {
  actor->recv_msg(41); // call
  actor->recv_msg(42); // call
  actor->recv_msg(43); // call
}

for (auto & active_actor : actors) {
  actor->update();              // vcall
  actor->handle_all_messages(); // vcall
}
```
::::::
:::::: {.flex-right}

```cpp
using container_type = std::vector<std::variant<A, B>>;

for (auto &active_actor: actors) {
  // vtable 的なものが作られるので不利？
  std::visit(
    [](auto &actor) {
      act.recv_msg(41); // call
      act.recv_msg(42); // call
      act.recv_msg(43); // call
    },
    active_actor
  );
}

for (auto &active_actor: actors) {
  // vtable 的なものが作られるが、
  // vtable 内の関数の定義には vcall がない。
  // よって有利？
  std::visit(
    [](auto &actor) {
      act.update();           // call
      act.handle_all_msgs();  // call
    },
    active_actor
  );
}
```
::::::
:::

### 使い方2 : 型ごとに違う処理
::: {.flex55}
:::::: {.flex-left}
```cpp
if (A *a = dynamic_cast<A*>(actor)) { ... }
else if (B *b = dynamic_cast<B*>(actor)) { ... }
```
::::::
:::::: {.flex-right}

```cpp
template<class... Ts> struct Visitor : Ts... { using Ts::operator()...; };
template<class... Ts> Visitor(Ts...) -> Visitor<Ts...>;

// 動的キャストなし。 RTTI 不要。
std::visit(
  Visitor {
    [](A &a) { ... },
    [](B &b) { ... },
  },
  actor
);
```
::::::
:::


## 比較
### 速度
[ここ](https://gist.github.com/olibre/3d0774df0f7a16e2da10fae2b2f26c4f)のコードをベースに実験した。

<details>
<summary>コード</summary>

```cpp
#include <queue>
#include <variant>
#include <iostream>
#include <memory>
#include <benchmark/benchmark.h>

using message_type = int;

namespace using_CRTP_and_variants {
    template <typename T>
    struct Actor {
        void update() {
            as_underlying().update();
        }

        void handle_all_messages() {
            while (!pending_messages.empty()) {
                auto message = std::move(pending_messages.front());
                pending_messages.pop();
                handle_one_message(std::move(message));
            }
        }

        void receive_message(message_type && msg) {
            pending_messages.emplace(std::forward<message_type>(msg));
        }

    private:
        friend T;
        Actor() = default;

        std::queue<message_type> pending_messages;

        inline T & as_underlying() {
            return static_cast<T&>(*this);
        }
        inline T const & as_underlying() const {
            return static_cast<T const &>(*this);
        }

        void handle_one_message(message_type && msg) {
            as_underlying().handle_one_message(std::forward<message_type>(msg));
        }
    };

    struct A : Actor<A> {
        using Actor::Actor;

        void update() {
            //std::cout << "A : update()\n";
        }

    private:
        friend struct Actor<A>;

        void handle_one_message (message_type && msg) {
            //std::cout << "A : handle_one_message : " << msg << '\n';
        }
    };
    struct B : Actor<B> {
        using Actor::Actor;

        void update() {
            //std::cout << "B : update()\n";
        }

    private:
        friend struct Actor<B>;

        void handle_one_message (message_type && msg) {
            //std::cout << "B : handle_one_message : " << msg << '\n';
        }
    };
}

namespace using_inheritance {
    struct Actor {
        virtual ~Actor() = default;
        virtual void update() = 0;

        void handle_all_messages() {
            while (!pending_messages.empty()) {
                auto message = std::move(pending_messages.front());
                pending_messages.pop();
                handle_one_message(std::move(message));
            }
        }

        void receive_message (message_type && msg) {
            pending_messages.emplace(std::forward<message_type>(msg));
        }

    private:
        std::queue<message_type> pending_messages;

        virtual void handle_one_message(message_type && msg) = 0;
    };

    struct A : Actor {
        void update() override {
            //std::cout << "A : update()\n";
        }
        void handle_one_message(message_type && msg) override {
            //std::cout << "A : handle_one_message : " << msg << '\n';
        }
    };

    struct B : Actor {
        void update() override {
            //std::cout << "B : update()\n";
        }
        void handle_one_message(message_type && msg) override {
            //std::cout << "B : handle_one_message : " << msg << '\n';
        }
    };
}

static void test_CRTP_and_variants(benchmark::State& state) {

    using container_type = std::vector<
        std::variant<
            using_CRTP_and_variants::A,
            using_CRTP_and_variants::B
        >
    >;

    container_type actors {
        using_CRTP_and_variants::A{},
        using_CRTP_and_variants::B{},
        using_CRTP_and_variants::A{},
        using_CRTP_and_variants::B{},
        using_CRTP_and_variants::A{},
        using_CRTP_and_variants::B{},
        using_CRTP_and_variants::A{},
        using_CRTP_and_variants::B{},
        using_CRTP_and_variants::A{},
        using_CRTP_and_variants::B{}
    };

    for (auto _ : state) {
        for (auto & active_actor : actors) {
            std::visit([](auto & act) {
                act.receive_message(41);
                act.receive_message(42);
                act.receive_message(43);
            }, active_actor);
        }

        for (auto & active_actor : actors)
        {
            std::visit([](auto & act) {
                act.update();
                act.handle_all_messages();
            }, active_actor);
        }
        benchmark::DoNotOptimize(actors);
    }
}

static void test_CRTP_and_variants_stack_ptr(benchmark::State& state) {
    using poly = std::variant<
        using_CRTP_and_variants::A,
        using_CRTP_and_variants::B
    >;

    using container_type = std::vector<poly*>;

    poly v0 = using_CRTP_and_variants::A{};
    poly v1 = using_CRTP_and_variants::B{};
    poly v2 = using_CRTP_and_variants::A{};
    poly v3 = using_CRTP_and_variants::B{};
    poly v4 = using_CRTP_and_variants::A{};
    poly v5 = using_CRTP_and_variants::B{};
    poly v6 = using_CRTP_and_variants::A{};
    poly v7 = using_CRTP_and_variants::B{};
    poly v8 = using_CRTP_and_variants::A{};
    poly v9 = using_CRTP_and_variants::B{};


    container_type actors {
        &v0,
        &v1,
        &v2,
        &v3,
        &v4,
        &v5,
        &v6,
        &v7,
        &v8,
        &v9
    };

    for (auto _ : state) {
        for (auto & active_actor : actors) {
            std::visit([](auto & act) {
                act.receive_message(41);
                act.receive_message(42);
                act.receive_message(43);
            }, *active_actor);
        }

        for (auto & active_actor : actors)
        {
            std::visit([](auto & act) {
                act.update();
                act.handle_all_messages();
            }, *active_actor);
        }
        benchmark::DoNotOptimize(actors);
    }
}

static void test_CRTP_and_variants_unique_ptr(benchmark::State& state) {
    using poly = std::variant<
        using_CRTP_and_variants::A,
        using_CRTP_and_variants::B
    >;

    using container_type = std::vector<std::unique_ptr<poly>>;



    container_type actors;
    {
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::A{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::B{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::A{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::B{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::A{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::B{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::A{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::B{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::A{}));
        actors.emplace_back(std::make_unique<poly>(using_CRTP_and_variants::B{}));
    }

    for (auto _ : state) {
        for (auto & active_actor : actors) {
            std::visit([](auto & act) {
                act.receive_message(41);
                act.receive_message(42);
                act.receive_message(43);
            }, *active_actor);
        }

        for (auto & active_actor : actors)
        {
            std::visit([](auto & act) {
                act.update();
                act.handle_all_messages();
            }, *active_actor);
        }
        benchmark::DoNotOptimize(actors);
    }
}

static void test_inheritance_unique_ptr(benchmark::State& state) {
    using container_type = std::vector<std::unique_ptr<using_inheritance::Actor>>;

    container_type actors;
    {
        actors.emplace_back(std::make_unique<using_inheritance::A>());
        actors.emplace_back(std::make_unique<using_inheritance::B>());
        actors.emplace_back(std::make_unique<using_inheritance::A>());
        actors.emplace_back(std::make_unique<using_inheritance::B>());
        actors.emplace_back(std::make_unique<using_inheritance::A>());
        actors.emplace_back(std::make_unique<using_inheritance::B>());
        actors.emplace_back(std::make_unique<using_inheritance::A>());
        actors.emplace_back(std::make_unique<using_inheritance::B>());
        actors.emplace_back(std::make_unique<using_inheritance::A>());
        actors.emplace_back(std::make_unique<using_inheritance::B>());
    }

    for (auto _ : state) {
        for (auto & active_actor : actors) {
            active_actor->receive_message(41);
            active_actor->receive_message(42);
            active_actor->receive_message(43);
        }

        for (auto & active_actor : actors) {
            active_actor->update();
            active_actor->handle_all_messages();
        }
        benchmark::DoNotOptimize(actors);
    }
}

static void test_inheritance_stack_ptr(benchmark::State& state) {

    using container_type = std::vector<using_inheritance::Actor*>;

    auto k0 = using_inheritance::A();
    auto k1 = using_inheritance::B();
    auto k2 = using_inheritance::A();
    auto k3 = using_inheritance::B();
    auto k4 = using_inheritance::A();
    auto k5 = using_inheritance::B();
    auto k6 = using_inheritance::A();
    auto k7 = using_inheritance::B();
    auto k8 = using_inheritance::A();
    auto k9 = using_inheritance::B();

    container_type actors {
        &k0,
        &k1,
        &k2,
        &k3,
        &k4,
        &k5,
        &k6,
        &k7,
        &k8,
        &k9
    };

    for (auto _ : state) {
        for (auto & active_actor : actors) {
            active_actor->receive_message(41);
            active_actor->receive_message(42);
            active_actor->receive_message(43);
        }

        for (auto & active_actor : actors) {
            active_actor->update();
            active_actor->handle_all_messages();
        }
        benchmark::DoNotOptimize(actors);
    }
}

BENCHMARK(test_CRTP_and_variants);
BENCHMARK(test_CRTP_and_variants_stack_ptr);
BENCHMARK(test_CRTP_and_variants_unique_ptr);
BENCHMARK(test_inheritance_unique_ptr);
BENCHMARK(test_inheritance_stack_ptr);
BENCHMARK_MAIN();
```

</details>

コンパイルオプション :
```
# https://github.com/google/benchmark.git を利用
clang++ bench.cpp -std=c++20 -isystem benchmark/include -Lbenchmark/build/src -lbenchmark -lpthread -O3
```

結果 :
```
----------------------------------------------------------------------------
Benchmark                                  Time             CPU   Iterations
----------------------------------------------------------------------------
test_CRTP_and_variants                  63.6 ns         63.6 ns     10815588
test_CRTP_and_variants_stack_ptr        62.9 ns         62.9 ns     11092325
test_CRTP_and_variants_unique_ptr       61.3 ns         61.3 ns     10988580
test_inheritance_unique_ptr              116 ns          116 ns      6022044
test_inheritance_stack_ptr               103 ns          103 ns      6673525
```

少なくともこの例では CRTP + `variant` が速い。<br>
ちなみに、 Rust 界隈にも[似たような話](https://tourofrust.com/81_en.html)や[ベンチ](https://qiita.com/carrotflakes/items/896ce7f49931c64a2954)がある。

### 拡張性
状況 : ライブラリ内に上記コードがあり、それをユーザーが拡張したいとする。
- vcall : 子クラスを簡単に増やせる。
- CRTP + variant : 子クラスを増やすのは難しい。

[参考](https://zenn.dev/qnighy/articles/5b1ad05d72c19d)
