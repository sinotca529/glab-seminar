---
title: Model Checking (Sec.5.2)
tag: MC
date: yyyy-mm-dd
plug:
    graphviz: true
    pseudocode: true
    mermaid: true
---

# 5.2 Model-Checking CTL with Fairness Constraints
この節の目的:
: Fairness constraints を扱えるよう、5.1節の手法を拡張すること。

この節では、Fiarness constraints を $F = \{ P_1, \cdots, P_k\}$ と書く。

## 概要
CTL式は、¬, ∧, ∨, EG, EX, EU のみの形に変形(正規化)できる。<br>
よって、5.1節と同じく、これらを処理する関数を設計すれば良い。

このうち、¬, ∧, ∨ については5.1節で設計した関数を流用できる。

この節では、残るEG, EX, EUについて考える。

## $\textbf{E}_f\textbf{G}$の処理
## 用語 : 公平なSCC
クリプキ構造$M$上のSCC $C$ が次を満たすとき、 $C$ は $F$ について公平であるという。
$$ \forall P_i \in F,\ \exist t_i \in (C \cup P_i) $$

## 記法
クリプキ構造$M$のうち、$f_1$を公平に満たすノードのみを残したクリプキ構造を、$M'$と呼ぶ。
$$
    \begin{align*}
        M' = &(S', R', L', F') \ \ \text{ where}\\
             &S' = \{s\in S | M,s\vDash_F f_1\},\\
             &S' = R' = R|_{S'\times S'},\\
             &S' = L' = L|_{S'},\\
             &S' = F' = \{P_i \cup S' \ |\ P_i \in F\}
    \end{align*}
$$

## Lemma 5.3
$M,s \vDash_F \textbf{E}_F\textbf{G} f_1$と、次の2条件を両方満たすことは同値
1. $s \in S'$
2. $M'$上に、$s$からグラフ$(S', R')$の公平なMSCC上のノード$t$までのパスが存在

(証明は Lemma 5.1 と同様のため省略。)

## アルゴリズム
Lemma 5.3 を使うことで、`CheckFairEG`を作成できる。<br>
`CheckEG`との違いは、MSCCを用いるか、Fair MSCC を用いるかだけである。

```py {caption="CheckFairEG"}
def CheckFairEG(f1):
    S’ = { s ∈ S | f1 ∈ label(s) }
    FairMSCCs = get_all_fair_mscc(S’)
    T = ∪FiarMSCCs

    while T != ∅:
        s = T.pop()
        for t in s.parents():
            if (t ∈ S’) and (EG f1 ∉ label(t))
                label(t) += EG f1
                T += t
```

## 計算量
Fair MSCCを求める部分は、例えば次のように実装できる。

```py
def get_all_fair_mscc(S):
    FairMSCCs = ∅
    MSCCs = get_all_mscc(S)

    # key: 状態
    # value: その状態を含む P_i (∈ F) の集合
    d = {}

    # O(|F||S|)
    for P in Fair {
        for s in P {
            d[s] ∪= P
        }
    }

    for m in MSCCs {
        local = ∅
        for s in m:
            local ∪= map[s]
        if local.len() == |F|:
            FairMSCCs ∪= m
    }

    return FairMSCCs
```

公平性を検査する必要があるため、計算量は$O((|S| + |R|)\cdot|F|)$に増加。

## EX, EU
他のCTL式を公平クリプキ構造の元で検証するため、特別な原子式 $\textit{fair}$ を定義する。
$$ s \vDash \textit{fair} \iff \text{(There is a fair path starting from } s \text{. )} $$

なお、$\textit{fair} = \textbf{E}_F\textbf{G}\textit{true}$ である。

$M,s \vDash_F \textbf{E}_f\textbf{X}f_1$を検査するには、
$M,s \vDash \textbf{EX}(f_1  \land \textit{fair})$を調べれば良い。

$M,s \vDash_F \textbf{E}_f(f_1 \textbf{U} f_2)$を検査するには、
$M,s \vDash \textbf{E}(f_1 \textbf{U} (f_2 \land \textit{fair})))$を調べれば良い。

各ステップの計算量は$O((|S| + |R|)\cdot|F|)$なので、全体の計算量は$O(|f|\cdot(|S| + |R|)\cdot|F|)$である。

## Theorem 5.4
クリプキ構造$M = (S, R, L, F)$とCTL式$f$ について、$M \vDash_F f$ を$O(|f|\cdot(|S| + |R|)\cdot|F|)$ で調べるアルゴリズムが存在する。

## 具体例
$F = \{\{ s \ |\  s \vDash \textit{Start} \land \textit{Close} \land \neg\textit{Error}\}\}$とおく。

5.1節と似た、次の式を調べる。
$$ \textbf{A}_f\textbf{G}(\textit{Start} \rightarrow \textbf{A}_f\textbf{F}\textit{Heat}) $$を調べる。

### ステップ1 : 正規化
$$ \textbf{A}_f\textbf{G}(\textit{Start} \rightarrow \textbf{A}_f\textbf{F}\textit{Heat}) = \neg \textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))$$

### ステップ2 : 部分式の列挙
- $\textit{true}$
- $\textit{Start}$
- $\textit{Heat}$
- $\neg\textit{Heat}$
- $\textbf{E}_f\textbf{G}\neg\textit{Heat}$
- $\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}$
- $\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))$
- $\neg\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))$

### ステップ3 : ネストの浅い部分式から順に調べる
- $\llbracket\textit{true}\rrbracket = \{1, 2, 3, 4, 5, 6, 7\}$
- $\llbracket\textit{Start}\rrbracket = \{2, 5, 6, 7\}$
- $\llbracket\textit{Heat}\rrbracket = \{4, 7\}$
- $\llbracket\neg\textit{Heat}\rrbracket = \{1, 2, 3, 5, 6\}$

#### $\llbracket\textbf{E}_f\textbf{G}\neg\textit{Heat}\rrbracket$ について
1. $S' = \llbracket \neg\textit{Heat} \rrbracket = \{1, 2, 3, 5, 6\}$と置く
2. $S'$内の公平なMSCCを見つける
3. $S'$内の状態のうち、MSCC内の状態への経路がある状態を見つける
4. 見つけた状態の集合が$\llbracket\textbf{E}_f\textbf{G}\neg\textit{Heat}\rrbracket$である

- いま、$S'$内に公平なMSCCは存在しない 
- よって、$\llbracket\textbf{E}_f\textbf{G}\neg\textit{Heat}\rrbracket = \emptyset$

#### $\llbracket\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}\rrbracket$, $\llbracket\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))\rrbracket$ について
$\llbracket\textbf{E}_f\textbf{G}\neg\textit{Heat}\rrbracket = \emptyset$ なので、
$$ \llbracket\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))\rrbracket = \emptyset $$
である。

#### $\llbracket\neg\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))\rrbracket$ について
$\llbracket\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))\rrbracket = \emptyset$ なので、

$$ \llbracket\neg\textbf{E}_f(\textit{true} \textbf{U} (\textit{Start} \land \textbf{E}_f\textbf{G}\neg\textit{Heat}))\rrbracket = S $$
である。
