---
title: 今度こそ覚える Precision, Accuracy, Recall
date: 2023-05-01
tag:
    - LT
---

# 今度こそ覚える Precision, Accuracy, Recall
こいつらの定義が一向に覚えられない．<br>
そうだ， ChatGPT に聞いてみよう．

## まずは定義を聞いてみる
::: {.box}
\[Q\]<br>
統計学の文脈で使われる precision, accuracy, recall の定義をそれぞれ教えてください。

\[A\]<br>
これらの用語は、機械学習やデータマイニングの分野でよく使われるが、統計学でもよく使われる概念です。

- Precision（精度）：正確に予測されたものの中で、実際に正解であった割合を示します。真陽性（TP）の割合として定義されます。以下の式で表されます。<br>Precision = TP / (TP + FP)
- Accuracy（正確度）：すべての予測に対して、正解と予測が一致した割合を示します。真陽性と真陰性（TN）の割合として定義されます。以下の式で表されます。<br>Accuracy = (TP + TN) / (TP + FP + TN + FN)
- Recall（再現率）：実際に正解であるものの中で、正しく予測された割合を示します。真陽性の割合として定義されます。以下の式で表されます。<br>Recall = TP / (TP + FN)

これらの概念は、二値分類問題において、予測と実際の正解を比較するために使用されます。ただし、多クラス分類問題では、それぞれのクラスに対してこれらの指標を計算する必要があります。
:::

正しい定義が出力できている．

## 語呂合わせを作らせる
### 試行 1
::: {.box}
\[Q\]<br>
これら3つの用語それぞれについて、その定義を覚えるための語呂合わせを考えてください。

\[A\]<br>
以下は、それぞれの用語の定義を覚えるための語呂合わせの例です。
- Precision（精度）：正解の「P」を、予測されたものの中で「P」recision（正確さ）を示す。つまり、「P」に着目することで、「Precision」が正解に近いかどうかを確認できる。
- Accuracy（正確度）：「Accu」rate（正確な）予測の「acy」で、「Accuracy」という言葉ができる。つまり、「Accuracy」は、正解に対してどの程度正確な予測ができているかを示す。
- Recall（再現率）：「Re」al positives（真の陽性）を「call」する。つまり、「Recall」は、正解のうちどの程度の割合を正しく予測できているかを示す。
:::

???

### 試行 2
::: {.box}
\[Q\]<br>
別の語呂合わせを考えてください。

\[A\]<br>
以下は、別の語呂合わせの例です。
- Precision（精度）：「P」redicted positive（予測された陽性）のうち、「P」recision（正確さ）が高いと、陽性と判定されたものが実際に陽性である確率が高いことを示す。
- Accuracy（正確度）：「A」ll correct（すべて正しい）予測の割合を示す。「Accuracy」は、すべての予測がどの程度正解に近いかを示す指標である。
- Recall（再現率）：「Re」member positive（陽性を思い出す）と考える。「Recall」は、実際の陽性のうち、どの程度を正しく予測できたかを示す指標である。
:::

<br>

- **P**recision は **P**redicated positive ではなくて **P**ositive に結びつけるのが良いのでは？
- **A**ccuracy と **A**ll を結びつけるの良さそう．

残るは Recall.

### 試行 3
::: {.box}
\[Q\]<br>
Recall について、別の語呂合わせを3つ考えてください。

\[A\]<br>
以下は、Recall（再現率）の語呂合わせの例です。
- Recall（再現率）：「R」emember the positives（陽性を思い出す）。「Recall」は、実際の陽性のうち、どの程度を正しく予測できたかを示す指標である。
- Recall（再現率）：「Re」ally find positives（陽性を本当に見つけ出す）。つまり、「Recall」は、本当に陽性であるものをどの程度正しく見つけ出せたかを示す。
- Recall（再現率）：「R」ate of true positive（真陽性の割合）を表す。つまり、「Recall」は、正解のうちどの程度を正しく予測できたかを示す。
:::

うーん微妙．

## 今日の結論
- **P**recision の P は **P**ositive の P．
    - TP / (TP + FP)
- **A**ccuracy の A は **A**ll の A．
    - (TP + TN) / (TP + FP + TN + FN)
- **R**ecall の R は ...?
    - TP / (TP + FN)
