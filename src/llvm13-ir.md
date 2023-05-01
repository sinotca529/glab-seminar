---
date: 2023-MM-dd
title: LLVM13 マニュアル抜粋 [wip]
tag: llvm
---

# LLVM13 マニュアル抜粋
c.f [LLVM Language Reference Manual](https://releases.llvm.org/13.0.0/docs/LangRef.html)

## 識別子 (Identifier)
- 局所識別子 : `%` で始まる．
- 大域識別子 : `@` で始まる．
    - LLVM の大域変数はすべて，値を格納する場所へのポインタ．

## コメント
- `;` 以降行末まで．

## Module
- Module : LLVM の翻訳単位
    - 関数 + 大域変数 + 記号表 (シンボルテーブル)

## Linkage Type
- `private`
    - 同一モジュール内からのみアクセス可能．
    - 記号表には載らない．
- `internal`
    - C の `static` キーワードに対応．
    - 同一モジュール内からのみアクセス可能．
    - `STB_LOCAL` に載る．
- `available_externally`
    - 無視して良い?
- `linkonce`
    - リンク時に名前が衝突したら統合する．
- `weak`
    - C の `weak` に対応．
    - 多重定義があった際にこの定義を捨てる．
- `common`
    - ?
- `appending`
- `extern_weak`
- `linkonce_odr`
- `weak_odr`
- `external`

## 可視性
グローバル変数と関数は可視性の指定を持つ．
- `default`
    - ELF のオブジェクトファイルの場合 :
        - 他のモジュールに宣言が見える．
    - ELF の共有ライブラリの場合 :
        - 宣言は上書き可能．
- `hidden`
    - 他のモジュールがこの変数を直接参照することはできない．
    - 動的シンボルテーブルに載らない．
- `protected`
    - 動的シンボルテーブルに載る．
    - そのサシ先はローカルシンボルである．
    - すなわち，そのシンボルは他のモジュールで上書きできない．

## グローバル変数
- コンパイル時に配置するメモリ領域が決定する．
- 初期化できる．
- 配置するセクションを明示できる．
- アラインメントを指定できる．

## 型システム
- void : `void`
- 関数 : `<retty> (<param list>)`
    - `i32 (i32)`
    - `i32 (i8*, ...)`
    - `{i32, i32} (i32)`
- 第一級型 (命令の返り値として取れる型)
    - 整数 : `iN` (`N` はビット長)
    - 小数 : `half`, `bfloat`, `float`, ...
    - ポインタ : `<type>*`
        - `[4 x i32]*` : 配列へのポインタ
        - `i32 (i32*) *` : 関数ポインタ
        - `void*` や `label*` は存在しない．代わりに `i8*` を使う．
    - ベクタ型 (SIMD 用)
    - ラベル型
    - トークン型
    - メタデータ型
    - 集約型 (aggregate type)
        - array 型 : `[40 x i32]`, `[3 x [4 x i32]]]`
        - struct 型 : `{ i32, i32 }`, `<{ i8, i32 }>`
            - `<>` 囲みは packed.
            - メモリ内の struct の要素には， `getelementptr` でポインタを得て `load`/`store` でアクセス
            - レジスタ内の struct の要素には，`extractvalue`/`insertvalue` でアクセス

- target extension type
- vector type
    - SIMD で使う．

## 定数
- Token : `none` は空のトークン型の値
- 大域変数，関数のアドレス
    - これらはリンク時に確定する． (大域変数はすべてポインタなので)
- undef
- poison
- well-defined
- address of bb
- dso local
- constexpr

## その他の値
- インラインアセンブリ : よしなに作った値を `call`/`invoke` して使う．

## メタデータ

## 組み込み大域変数

## 命令
- 終端命令
    - `ret`
    - `br`
    - `switch`
    - `indirectbr`
    - `invoke`
    - `callbr`
    - `resume`
    - `catchswitch`
    - `catchret`
    - `cleanupret`
    - `unreachable`
- 単項演算
    - `fneg`
- 二項演算
    - `add`
    - ...
- ベクトル演算 (SIMD)
    - ...
- メモリアクセス
    - `alloca`
    - `load`
    - `store`
    - `fence`
    - `cmpxchg`
    - `atomicrmw`
    - `getelementptr`
- 変換
    - `trunc .. to`
    - ...
- その他
    - `icmp`
    - `fcmp`
    - `phi`
    - `select`
    - `freeze`
    - `call`
    - `va_arg`
    - `landingpad`
    - `catchpad`
    - `cleanuppad`
- 組み込み関数
    - 可変長引数系
    - GC 系
    - コード生成系
    - 標準 C/C++ 系
        - `llvm.memcpy`
        - `llvm.memcpy.inline`
        - `llvm.memmove`
        - `llvm.memset.*`
    - ループ
        - `llvm.set.loop.iterations.*`
        - `llvm.start.loop.iterations.*`
        - `llvm.test.set.loop.iterations.*`
        - `llvm.test.start.loop.iterations.*`
        - `llvm.loop.decrement.reg.*`
        - `llvm.loop.decrement.*``
    - デバッガ用
    - トランポリン用
    - その他
        - `llvm.var.annotation`
        - `llvm.ptr.annotation`
        - `llvm.annotation.*`
    - 要素単位原子命令
        - `llvm.memcpy.element.unordered.atomic`
        - `llvm.memmove.element.unordered.atomic`
        - `llvm.memset.element.unordered.atomic`
    - ...
