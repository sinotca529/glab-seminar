---
title: トリッキーなスライスの取り方
date: 2022-04-25
tag: LT
---

# トリッキーなスライスの取り方
```py {caption="take-slice.py"}
s = "0123456789"
offset = 3
length = 2

# これは
sub1 = s[offset:offset+length]    #            s[offset:]
assert(sub1 == "34")              #           _____|_____
                                  #          /           \
# こうも書ける                    # s [0 1 2 3 4 5 6 7 8 9]
sub2 = s[offset:][:length]        #          \_/
assert(sub2 == "34")              #            s[offset:][:length]
```

利点 :
- `offset`を2回書かなくていい

欠点 :
- 初見は混乱するかも
- スクリプト言語でやるとオーバヘッドがあるかも


<span style="color:red">**注意 : トリッキーな書き方は用量・用法を守りましょう。**</span>

[ネタ元](https://twitter.com/m_ou_se/status/1403426221367627777)
