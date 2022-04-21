---
title: OOM-Killerにcc1plusをkillされた話
date: 2022-04-15
tag: LT
---

# OOM-Killer に cc1plus をkillされた話


## LLVM のビルドに失敗
毎度のごとく、LLVMのビルドに失敗した。<br>
どうせ いつもの「virtual memory exhausted: Cannot allocate memory」だろうと思いきや、見たことのないエラーが。

`cc1plus` (`g++`が呼び出す狭義のコンパイラ) が Kill されたらしい。
```
$ cmake --build .

(-- snipped --)

c++: fatal error: Killed signal terminated program cc1plus
```


## 原因 : リソース不足
Google先生曰く、どうやら OOM-Killer の仕業らしい。

- OOM : Out-Of-Memory
- リソースが足りないときに適当なプロセスをKillする
- リソース不足でシステム全体がダウンすることを防いでくれる

`cc1plus`は犠牲になったのだ。

(ちなみに、今回ビルドに失敗したPCのメモリは8GBしかない。研究室から借りたPCを使えばもう少し頑張れるはず。)


## ログを覗く
`cat /var/log/syslog | grep Kill` でログを見てみると :
```txt
Apr 21 18:54:33 (HOST-NAME) kernel: [   48.192626] Out of memory: Killed process 274 (cc1plus) total-vm:715960kB, anon-rss:572228kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1432kB oom_score_adj:0
Apr 21 18:54:33 (HOST-NAME) kernel: [  109.555946] Out of memory: Killed process 402 (cc1plus) total-vm:704832kB, anon-rss:656452kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1412kB oom_score_adj:0
Apr 21 18:54:33 (HOST-NAME) kernel: [  163.459520] Out of memory: Killed process 478 (cc1plus) total-vm:750692kB, anon-rss:514892kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1496kB oom_score_adj:0
Apr 21 18:54:33 (HOST-NAME) kernel: [  236.053123] Out of memory: Killed process 580 (cc1plus) total-vm:750616kB, anon-rss:321836kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1496kB oom_score_adj:0
Apr 21 18:54:33 (HOST-NAME) kernel: [  325.111948] Out of memory: Killed process 706 (cc1plus) total-vm:733492kB, anon-rss:282628kB, file-rss:4kB, shmem-rss:0kB, UID:1000 pgtables:1456kB oom_score_adj:0
Apr 21 18:54:33 (HOST-NAME) kernel: [  331.543347] Out of memory: Killed process 702 (cc1plus) total-vm:659552kB, anon-rss:317520kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1324kB oom_score_adj:0
Apr 21 18:54:33 (HOST-NAME) kernel: [ 1053.453668] Out of memory: Killed process 2076 (cc1plus) total-vm:559516kB, anon-rss:413612kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1120kB oom_score_adj:0
Apr 21 18:55:17 (HOST-NAME) kernel: [ 3028.760734] Out of memory: Killed process 4024 (cc1plus) total-vm:568000kB, anon-rss:440584kB, file-rss:0kB, shmem-rss:0kB, UID:1000 pgtables:1144kB oom_score_adj:0
```

確かにOut of memoryでプロセスがkillされている。


## 対処 : スレッド数を制限
とりあえず`cmake --build . -- -j4`とスレッド数を制限してみた。<br>
→ Killされる頻度がだいぶ落ちた。

他にも色々と対処法がありそう。


## 感想
以前から、LLVMのビルド中に「virtual memory exhausted: Cannot allocate memory」に出くわすことはよくあった。<br>
しかし、今回のエラーを見るのは初めて。

前回のビルドからの変更点は
- 定期的な`apt update` & `apt upgrade`
- LLVMのバージョンを 12.0.0 から 12.0.1 に変更
- (windows 11 にアプデ)

くらい。

根本原因は同じだが、表示されるエラーが替わった理由は謎である。
