---
title: autogobble のススメ
date: 2022-05-13
tag:
    - LT
    - LaTeX
---

# autogobble のススメ
- $\LaTeX$ にコード片を書くとき、インデントの扱いが面倒。
- この問題は、`autogobble` パッケージで解決できる。

## 解決したい問題
左のコードをタイプセットすると、右のような見た目になったりする。
::: {.flex55}
:::::: {.flex-left}
```tex {caption=ソース}
\begin{lstlisting}[]
    fn main() {
        println!("Hello, world!");
    }
\end{lstlisting}
```
::::::
:::::: {.flex-right}
```txt {caption=出力}
    fn main() {
        println!("Hello, world!");
    }
```
::::::
:::

## \[解決\] autogobble を使う。
::: {.flex55}
:::::: {.flex-left}
```tex {caption=ソース(autogobble使用)}
\usepackage{lstautogobble}

\begin{lstlisting}[autogobble=true]
    fn main() {
        println!("Hello, world!");
    }
\end{lstlisting}
```
::::::
:::::: {.flex-right}
```txt {caption=出力}
fn main() {
    println!("Hello, world!");
}
```
::::::
:::

`lstlisting` のグローバルオプションとして設定しておくともっと便利。<br>
(`\lstset{..., autogobble=true}` とする。)

## 余談
autogobble を使わずとも、オプションで `gobble=x` とすれば前から`x`文字切り取ってくれる。<br>
ただし、`x`　は手動で決めなくてはならない。
