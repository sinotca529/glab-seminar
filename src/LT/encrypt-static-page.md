---
title: 静的サイトをパスワードで保護
date: 2022-05-06
tag: LT
---

# 静的サイトのパスワードによる保護
GitHub Pages等の静的サイトホスティングサービスは無料で使えて便利。<br>
でも、Basic認証などによるアクセス制限ができない。<br>

→ JavaScript で頑張れる、という話。

## 流れ
1. 守りたいHTMLを暗号化する。
2. その暗号文をJavaScriptの変数として埋め込んだHTMLを公開する。
3. ユーザにパスワードを入力させ、復号し、得られた平HTML文を表示する (by JavaScript)。

## 実装例
[StatiCrypt](https://github.com/robinmoisson/staticrypt) : [暗号化されたページの例](https://robinmoisson.github.io/staticrypt/example_encrypted.html)
