---
title: CFL-reachability
date: 2023-01-20
tag :
    - scrap
---

# CFL-reachability [wip]
グラフ問題の一つ．

**入力 :**
- 各辺にラベル ($a \in \Lambda$) がついた**グラフ $G$**．
- アルファベットが $\Lambda$ な**文脈自由文法 $H$**

**求めるもの :**
- グラフ上の経路で，ラベルの並びが $H$ の言語に含まれるもの．


## プログラム解析への応用
次の文法を考える :
- $S \rightarrow S S \ |\ (_1 S )_1 \ |\ \cdots \ |\ (_n S )_n \ |\ \varepsilon$

開き括弧を関数呼び出し，閉じ括弧を関数リターン，それ以外を $\varepsilon$と考えると，これはプログラムのトレースを表す．
