---
title: ポインタ解析
date: 2022-12-XX
tag:
    - points-to
---

# ポインタ解析

## Andersen のポインタ解析
特性
- 精度 : context-insensitive, flow-insensitive
- 計算量 : O(n^3) (n は変数の数)

手順
1. プログラムを正規化
2. 解析

### プログラムの正規化
「ポインタ変数のアドレスを取得しない形式」に変換する．

::: {.flex55}
:::::: {.flex-left}
```c {caption="変換前"}
int a; int *p; int **pp;
a = 10;
*p = &a;
**pp = &p;
```
::::::
:::::: {.flex-right}
```c {caption="変換後"}
int a; int *p; int **pp;
int *_b; int **q_p;
q_p = &_b;

a = 10;
*(*q_p)  = &a;
**pp = &(*q_p);
```
::::::
:::


Andersen のポインタ解析は， はじめに，ポインタ変数の集合 P と address-taken な変
数の集合 A が共通部分を持たない形にプログラムを変換
する．もし変数 v ∈ P ∩ A が存在するなら，式 w = &a を
導入し， v を *w に置き換えることでこの変換を行う．
続いて，各変数の指し先集合に関する制約をポインタに
関する式をもとに集める．制約の収集には次の規則を用
いる．
