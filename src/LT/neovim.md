---
title: お前も vimmer にならないか？
date: 2023-05-12
tag: LT
---

# お前も vimmer にならないか？
別に emacs でも vi でも neovim でも何でも良い．<br>
好きな TUI エディタを使おう．

かく言う私は neovim 派．<br>
内田くんに布教されて vimmer になってから早1年半．

## Vim の利点は？
**カッコイイ．**
- みんな密かに憧れている (はず)．

**高速にテキスト編集できる．**
- 起動が速い．
- キーボードから手を離さなくていい． (ただし A キーの左隣に Ctrl を当てるのは必須)
- マスターすると思考の速度で編集できる (らしい)．

**おっさんホイホイ．**
- 今のおっさんは (たぶん) vim/emacs 世代．
- インターンで颯爽と vim を開いて周りに差を付けよう (?)．

## Vim の欠点は？
- 学習曲線が急． (とは言え，枯れているので覚えれば一生使える)
    - <blockquote class="twitter-tweet"><p lang="ja" dir="ltr">🌀ワロタ <a href="https://twitter.com/hashtag/vim?src=hash&amp;ref_src=twsrc%5Etfw">#vim</a> <a href="https://twitter.com/hashtag/SoftwareDesign?src=hash&amp;ref_src=twsrc%5Etfw">#SoftwareDesign</a> <a href="https://t.co/Mu8HcxCLFu">pic.twitter.com/Mu8HcxCLFu</a></p>&mdash; panponpenpe (@jagnuKG) <a href="https://twitter.com/jagnuKG/status/1537731767427141633?ref_src=twsrc%5Etfw">June 17, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
- プラグインの選定・設定が難しい．
    - プラグインを入れないと IDE ネイティブ世代には厳しい．
    - でも[選択肢が多すぎて選ぶのに苦労する．](https://zenn.dev/yutakatay/articles/neovim-pluginlist)

## で，習得にどれくらい掛かるの？
基本的な操作はそのうち慣れる．
- VSCode の編集速度を越えるには1週間 ~ 1ヶ月．

ボトルネックはプラグインの整備．
- 他人の設定のコピペでいいならすぐ終わる．
- しかしニーズは人それぞれ．
    - コピペでは機能不足・過剰を感じると思われる．
    - また，どのキーにどの機能がバインドされているかを把握するのも一苦労．
    - [私の設定](https://github.com/sinotca529/dotfiles/tree/main/nvim/.config/nvim) と [内田くんの設定](https://github.com/ucchiee/nvim) を比べても，プラグインマネージャの時点で違うものを使っている．
