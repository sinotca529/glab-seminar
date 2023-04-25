---
title: おまえの YouTube は n 倍遅い
date: 2023-04-25
tag: LT
---

# おまえの YouTube は n 倍遅い
時間は有限なのに YouTube は2倍速まで．<br>
もっと《加速》したいですよね？

### それ， Bookmarklet でできます
Bookmarklet : ブックマークから JavaScript を呼ぶしくみ．

↓ をブックマークのリンクに指定して呼び出すだけ．
```js {caption="2.5倍速"}
javascript:(()=>{document.querySelector('.video-stream.html5-main-video').playbackRate=2.5;})();
```

### おまけ
自己責任ですが，某マトリクス認証も自動化できます．<br>
なんたらアプリに課金しなくておｋ．
