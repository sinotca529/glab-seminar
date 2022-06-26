---
title: \[WIP\] Garbage Collection (Sec.8)
date: yyyy-mm-dd
tag: GC
plug:
    graphviz: true
---

# Incremental and Concurrent Garbage Collection (GC 8.1 - 8.4)
Interactive / real-time システムでは，GCのポーズ時間を減らしたい．

|        |   Generational   |   Incremental    |
| -----: | :--------------: | :--------------: |
| 着眼点 | 平均計算量の削減 | 最悪計算量の削減 |

## Generational GC の問題点
GCのポーズ時間を減らす手法として， generational GC (7章) を見た．<br>
しかし，このアルゴリズムは :
- "予想" が外れると上手く動かない．

## Incremental / Real-time GC
- GCのポーズ時間を減らす手法．
- 目的 : 最悪計算量の削減．

GC には，trace

Incremental GC の一例に，RC がある．
- ポインタの更新が遅い．
- 循環データ構造を扱えない．
- → ダメダメ．

この章では incremental な tracing GC を見る．

なお，主に sequential (非並行) なマシンを扱う．

以降で紹介するアルゴリズムの一部は，元々マルチプロセッサ用に考案されたものを sequential に適用したものである．

## Sequential GC
- ユーザプログラム と GC が並列に動かせば良い．
- 各 allocate 毎に k word 分だけグラフを trace してマークすることを考える．
  - k が小さいほど ポーズが<quiz>短く</quiz>，一時的なメモリリーク量は<quiz>多く</quiz>なる．

要件 : メモリが枯渇しないこと

- GC のあるサイクルの開始時に， $R$ word が到達可能だったとする．
- 各 allocate では，$1$ word 確保し，$k$ word にマークを付ける．
  - 確保したノードもマークする．

このとき，
- $R$ word を全て mark するには， $\frac{R}{k}$ 回の allocate が必要．
- その間に確保されるのは $\frac{R}{k}$ word．
- よって，trace 完了時には
