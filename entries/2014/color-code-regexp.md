---
title: カラーコードかどうかを判定する正規表現
created_at: 2014-06-15
tags: regexp
---

```
^#([\da-fA-F]{6}|[\da-fA-F]{3})$
```

これでよさそう。検証用に使った文字列は以下の通りです。

```
#339
#251
#aaa
#fff
#AAA
#cdf
#Abc3Fc
#F9012b
#afdcbf
#987345
#9af#f6f
339
621345
af89f8
#ggg
#fgf
#delcmi
#3r9
#-12345
#jjjjjj
#aaaaaaa
jkhfng
ff8iju
```

## 検証に使ったサイト

[Regular Expression Playground - version 1.0](http://burkeware.com/software/regex_playground.html)

Global (g)と Multi-line (m)のオプションを使いました。

## 参考

- [正規表現 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions)
- [サルにもわかる正規表現入門](http://www.mnet.ne.jp/~nakama/)
