---
title: メールの件名が文字化けするんだが？
date: 2022-04-15
tag: LT
---

# メールの件名が文字化けするんだが？
メールの件名、たまに文字化けしませんか？

```{caption=文字化けメールの例}
----------------------------------
件名 : Zoomのフォーカスモードの��用について／Using Zoom's Focus Mode
From : xxx
To : yyy
日付: yyyy-mm-dd hh:mm
----------------------------------
...
```

→ おそらく、RFC2047まわりの問題です。

---
## 日本語の件名はエンコードして送れ (RFC2047)
[RFC2047](https://www.rfc-editor.org/rfc/rfc2047)

> This memo describes similar techniques to allow the encoding of non-ASCII text in various portions of a RFC 822 [2] message header, ...

日本語はNon-ASCII Textなので、このRFCに沿ったエンコーディングが必要。

---
## エンコード手順
1. 件名をBase64(とか)でエンコード
2. <span style="color:red">**得られた文字列を75文字以内の文字列群に分割**</span>
3. (文字列群を送信)

---
## エンコード手順に潜む罠
手順の2番目に罠がある。

RFC曰く :
> Each 'encoded-word' MUST represent an integral number of characters.

要するに :
<figure>
<figcaption class="code-caption">合法な分割・違法な分割</figcaption>
<pre style="border-style:solid;border-width:1px;">        平文 : <span style="color:red;">あ</span><span style="color:green;">い</span><span style="color:blue;">う</span>
エンコード後 : <span style="color:red;">AAAA</span><span style="color:green;">IIII</span><span style="color:blue;">UUUU</span>
  合法な分割 : <span style="color:red;">AAAA</span><span style="color:green;">IIII</span> / <span style="color:blue;">UUUU</span>
  違法な分割 : <span style="color:red;">AAAA</span><span style="color:green;">II</span> / <span style="color:green">II</span><span style="color:blue;">UUUU</span></pre>
</figure>

---
## 解析! 化けた件名
受信側のメーラが気の利かないメーラだと、次のようなことが起こる。
<figure>
<figcaption class="code-caption">気の利かないデコード</figcaption>
<pre style="border-style:solid;border-width:1px;">      違法な分割 : <span style="color:red;">AAAA</span><span style="color:green;">II</span> / <span style="color:green">II</span><span style="color:blue;">UUUU</span>
それぞれデコード : <span style="color:red;">あ</span><span style="color:green;">�</span> / <span style="color:green">�</span><span style="color:blue;">う</span>
            結合 : <span style="color:red;">あ</span><span style="color:green;">��</span><span style="color:blue;">う</span></pre>
</figure>
(おそらく)これが文字化けの原因である。


**結論 : 悪いのはRFC2047に従わない送信側のメーラ。(たぶん)**

おわり。