---
title: Model Checking (Sec.5)
tag: MC
date: yyyy-mm-dd
---
# Model Checking (Sec.5)
この章の目的 :
: クリプキ構造$M$, 式$f$について、$M \vDash f$の成立を調べること。

その手順 :
1. ${\llbracket f \rrbracket}_M \ (= \{s \in S\ | \ M,s \vDash f\})$を求める。
2. $S_0 \subseteq {\llbracket f \rrbracket}_M$ を調べる。

この章の流れ :
- ([5.1節](./mc5.1.html)) クリプキ構造の陽な表示 (explicit representation)について、モデルチェックのアルゴリズムを示す。
- ([5.2節](./mc5.2.html)) それに対し、公平性を踏まえた拡張をする。
- ([5.3節](./mc5.3.html)) CTL operators に対し、不動点characterizationを定義し、モデルチェックへの役立て方を示す。

<note>以下、$S_0$と$AP$は固定なのでしばしば略記します。</note>
