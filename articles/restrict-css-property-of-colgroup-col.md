---
title: colgroup 要素や col 要素は適用できる CSS のプロパティに制限がある
excerpt: やりたかったこと
categories: [技術]
tags: [CSS, HTML]
publishedAt: 2014-12-01T00:00:00.000Z
revisedAt: 2022-11-28T15:17:46.739Z
---

## やりたかったこと

```html
<table>
  <colgroup span="1" style="padding:10px; background:#66c; color:#fff; text-align: center;" />
  <tbody>
    <tr>
      <td>10</td>
      <td>foo</td>
    </tr>
    <tr>
      <td>20</td>
      <td>bar</td>
    </tr>
    <tr>
      <td>30</td>
      <td>baz</td>
    </tr>
  </tbody>
</table>
```

というHTMLを書いた際に、縦1列目にpadding, background, color, text-alignの指定が適用される想定でした。

## 問題

[上記の HTML を書いた JS Bin](http://jsbin.com/xaleva/4/edit?html,output)を見ると分かるように、backgroundの指定以外は適用されていません。なぜ？

## 分かったこと

[W3C の CSS 2.1 の仕様書内にある Tables 17.3 Columns](http://www.w3.org/TR/CSS21/tables.html#columns)を見ると分かるのですが、table-columnやtable-column-groupのプロパティが指定されている要素（col要素とcolgroup要素）には、下記4つのプロパティのみ指定できるようです。

- border
  - table要素に`border-collapse: collapse;`が指定されている時のみ適用される
- background
- width
- visibility

## まとめ

自分が適用したかったスタイルはcolgroup要素やcol要素では適用できないことが分かったので、colgroup要素やcol要素は使わないことにしました。

その代わりに、縦1列目にclassを指定して、そのclassに適用したかったスタイルを指定することにしました。
