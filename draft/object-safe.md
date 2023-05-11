---
date: yyyy-mm-dd
title: object-safety
tag: rust
---

# object safety
object safety : trait object を生成できる条件．
- `Self: Sized` でなく，
- 束縛，`where`，親トレイトの制約におけるトレイトの型引数に `Self` が出現せず，
- 全メソッドが object safe である．

メソッドが object safe とは:
- メソッドに `Self: Sized` がついている．
- あるいは次を満たす:
    - `self` 引数を持ち，
    - `self` 引数以外の引数・戻り値型に `Self` を含まず，
    - メソッドが型引数を取らない．

