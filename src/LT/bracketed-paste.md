---
title: Bracketed Paste
date: 2023-04-21
tag: LT
---

# Bracketed Paste
## 貼り付け大暴走
貼り付け内容に改行があるとコマンド実行が起きる．<br>
変なコマンドが実行されてそうで怖い．

```txt {caption="うっかり Hello World を貼り付けちゃったの図"}
user@pc1:~
$ #include <stdio.h>                  // クリップボードの内容
zsh: parse error near `\n'            //   #include <stdio.h>
user@pc1:~                            //   int main(void) {
$ int main(void) {                    //       puts("Hello world!");
zsh: unknown file attribute: v        //       return 0;
user@pc1:~                            //   }
$     puts("Hello world!");
dquote>     return 0;
dquote> }
```


## Bracketed Paste
これを防ぐしくみが [bracketed paste](https://en.wikipedia.org/wiki/Bracketed-paste) ．<br>
有効だと複数行の貼付けでコマンド実行が起きない．

```txt {caption="Bracketed paste が有効な状態で貼り付け"}
user@pc1:~
$ #include <stdio.h>
int main(void) {
    puts("Hello World!");
    return 0;
}
```

しくみ : 貼り付け内容の前後に特殊文字をつけてキー入力と貼り付けを区別．

## Bracketed Paste 機能の有効化
環境によって違うので各自調べて🙏<br>
端末エミュ・シェル・ターミナルマルチプレクサ・エディタ等々考えることは多いが，デフォで有効な場合も多そう．

tmux なら paste-buffer に p を渡して有効化．
```
# ruh-shell する際も同様
bind p paste-buffer -p
```
