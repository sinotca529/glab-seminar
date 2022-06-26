---
title: Model Checking (Sec.5)
tag: MC
date: 2022-06-20(0)
---
# Model Checking (Sec.5)
この章の目的 :
: クリプキ構造 $M$, CTL式 $f$ について、$M \vDash f$ の成立を調べること。

その手順 :
1. ${\llbracket f \rrbracket}_M \ (= \{s \in S\ | \ M,s \vDash f\})$ を求める。
2. $S_0 \subseteq {\llbracket f \rrbracket}_M$ を調べる。

2番は簡単なので、この節では1番にフォーカスする。

## この章の流れ
- ([5.1節](./mc5.1.html)) クリプキ構造の explicit representation  を検査するのアルゴリズムを示す。
- ([5.2節](./mc5.2.html)) 公平性を扱えるようアルゴリズムを拡張する。
- ([5.3節](./mc5.3.html)) 不動点を用いたアルゴリズムを示す。

## Bibliographic Notes
4章で考えた safety と liveness のモデル検査による処理を考える。<br>
- Safety : 悪いことが起こらない ($\textbf{AG}p$)。
- Liveness : いつかは良いことが起こる ($\textbf{AF}p$, $\textbf{A}(p\textbf{U}q)$)。

Safety は、reachability analysis を使って簡単に検査できる。<br>
一方、 liveness の検査には、より賢い手法が使われる。

Biere らは、 safety の判定を liveness の判定に効率よく変換でき、かつ fairness も扱える手法を提唱した。<br>
彼らの手法を使えば、liveness について、より単純で統一的なモデル検査が可能である。<br>
加えて、既存の liveness しか扱えない手法を  safety も扱えるよう拡張することも可能である。<br>
