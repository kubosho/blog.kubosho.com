---
title: カラーコードを正規表現を使って判定する
categories: [技術]
tags: [regexp, 正規表現]
publishedAt: 2014-06-15T00:00:00.000Z
revisedAt: 2022-11-28T13:39:59.728Z
---

カラーコードを判定するための正規表現を書きました。

```text
^#([\da-fA-F]{6}|[\da-fA-F]{3})$
```

カラーコードの正規表現が合っているかどうかの検証に使った文字列は次の通りです。

```text
// match
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
// mismatch
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

matchに挙げた文字列はカラーコードと判定されることを確認しています。またmismatchに挙げた文字列はカラーコードと判定されないことを確認してます。

## 正規表現の検証に使ったページ

[regex101: build, test, and debug regex](https://regex101.com/)

## 参考にしたページ

- [正規表現 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions)
- [サルにもわかる正規表現入門](https://userweb.mnet.ne.jp/nakama/)
