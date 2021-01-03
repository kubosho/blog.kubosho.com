---
title: RGB 値かどうかを判定する正規表現
created_at: 2014-01-12
tags: regexp
---

RGB 値を表現する正規表現を書いてみました。

```
^((2[0-4]\d|25[0-5]|1\d{1,2}|[1-9]\d|\d)( ?, ?)){2}(2[0-4]\d|25[0-5]|1\d{1,2}|[1-9]\d|\d)
```

これで大丈夫っぽい。検証に使った文字列は以下の通り。

```
0
20, 198
0, 0, 0
2, 3, 9
12, 10, 3
24, 32, 56
22,32,21
243, 254, 101
234, 222, 278
229, 187, 123
192, 213, 226
226, 226, 228
198, 174, 111
94, 23, 89
12, 45, 85
21, 32, 61
22 , 32 , 41
あ, お, う
a, b, c
256, 256, 256
-1, 23, 4
```

## 検証に使ったサイト

[Regular Expression Playground - version 1.0](http://burkeware.com/software/regex_playground.html)

Global (g)と Multi-line (m)のオプションを使いました。

## 参考

- [正規表現 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions)
- [サルにもわかる正規表現入門](http://www.mnet.ne.jp/~nakama/)
- [CSS3 Color の正規表現 for サクラエディタ - 血統の森+はてな](http://d.hatena.ne.jp/momdo/20111123/p1)
