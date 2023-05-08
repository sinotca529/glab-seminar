---
title: 特定の関数内部で標準出力に吐かれる内容を文字列として得る
date: 2022-12-09
tag:
    - Python
    - Tips
---

## 特定の関数内部で標準出力に吐かれる内容を文字列として得る
こうする．

```python
def capture_stdout(f) -> str:
    with io.StringIO() as tmp:
        with contextlib.redirect_stdout(tmp):
            f()
        tmp.seek(0)
        return tmp.read()
```

## C 言語では？
- dup, dup2 をこねくり回すことで実現できそう．
    - (fd の指し先を帰る前に flush を忘れずに．)
