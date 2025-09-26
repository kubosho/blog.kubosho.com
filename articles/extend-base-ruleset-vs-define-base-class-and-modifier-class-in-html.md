---
title: MindBEMding の Modifier は元のクラス名と一緒に指定するべきか否か
categories: [技術]
tags: [CSS]
publishedAt: 2015-05-11T00:00:00.000Z
revisedAt: 2022-06-21T06:22:12.830Z
---

MindBEMdingのModifierを定義する際、単一のクラスセレクタで書く方法と、複数のクラスセレクタで書く方法があります。

実際のHTMLで示すと以下のような感じです。

## HTMLの複数クラス定義

```html
<table class="mod-table-01 mod-table-01--line-color-green">
  <tr>
    <th>foo</th>
    <th>bar</th>
  </tr>
  <tr>
    <td>baz</td>
    <td>foobar</td>
  </tr>
</table>
```

## HTMLの単一クラス定義

```html
<table class="mod-table-02--line-color-green">
  <tr>
    <th>foo</th>
    <th>bar</th>
  </tr>
  <tr>
    <td>baz</td>
    <td>foobar</td>
  </tr>
</table>
```

`multiple class` とコメントで書かれているほうでは、クラス名は `mod-table-01` と `mod-table-01--line-color-green` の2つが指定されています。

`single class` とコメントで書かれているほうでは、クラス名は `mod-table-02--line-color-green` のみ指定されています。

上記のHTMLに対し、CSSでルールセットを書く場合は以下のようになります。

## CSSの複数クラス定義

```css
.mod-table-01 {
  border: 1px solid black;
  border-collapse: collapse;
  margin: 10px auto;
}
.mod-table-01--line-color-green {
  border: 1px solid green;
}
```

## CSSの単一クラス定義

```css
.mod-table-02,
.mod-table-02--line-color-green {
  border: 1px solid black;
  border-collapse: collapse;
  margin: 10px auto;
}
.mod-table-02--line-color-green {
  border: 1px solid green;
}
```

この2つの指定方法のうち、果たしてどちらが良いのかというのを考えたので、以下に利点と欠点を書いていきます。

## HTMLに単一のクラス名を指定する際の利点・欠点

### 利点：複数のクラスを指定するより、若干簡潔になる

MindBEMdingの考えでセレクタに名前を付けた場合は名前が長くなりがちです。複数のクラス名を指定した場合は、上記で示したHTMLの例を見ると分かるように冗長感が否めません。

その一方、単一のクラス名で指定した場合は、HTML側の指定は複数のクラス名指定より、簡潔になります。

### 欠点：スタイル定義が複雑になる

下記のJSFiddleの例を見ると分かるのですが、単一のクラス名を指定するほうが、複数のクラス名を指定するより、スタイル定義が複雑になっています。

<iframe width="100%" height="300" src="//jsfiddle.net/aempn99y/2/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

これは例えば、後からプロジェクトに入ってきた人がCSSファイルで定義されている内容を見た時に、理解を妨げる原因になるのではという考えがあります。

### 欠点：CSS のファイルサイズが大きくなりがち

[文字数 カウント（文字バイト数チェック）](http://www.luft.co.jp/cgi/str_counter.php)で測ると分かるのですが、単一のクラス名をHTML側で指定してスタイル定義をしていく場合、複数のクラス名をHTML側で指定するより、CSSのファイルサイズが大きくなります。

## HTMLに複数のクラス名を指定する際の利点

### 利点：スタイル定義の見通しが良くなる

再び先ほどのJSFiddleの例を引っ張り出しますが、複数のクラス名を指定する場合、単一のクラス名を指定するよりCSSのルールセット定義が簡潔になっています。

<iframe width="100%" height="300" src="//jsfiddle.net/aempn99y/2/embedded/result,html,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### 欠点：HTML上でのクラス名の指定が単一のクラスを指定するより若干冗長になる

単一のクラス名を定義する時はHTMLでは `prefix-table-01--line-color-green` とだけclass属性の値に書けばよかったですが、複数のクラスを定義する場合は `prefix-table-01 prefix-table-01--line-color-green` と若干冗長になります。

## 結果どちらを使ったほうが良いのか

単一のクラス名を指定するほうはHTML側が少し簡潔になりますが、複数のクラス名を指定するのと比べCSS側が複雑になりがちというのは先ほど書いたとおりです。

その複雑になりがちというのが自分ではあまり許容できなかったので、複数のクラス名をHTMLのclass属性の値として指定して、スタイル定義をしていくのが良いかなと思いました。

## 他の参考記事

マルチクラス設計について物申している記事もあるので、よかったらこちらも参考にしてみてください。

[CSSプリプロセッサーの`extend`の悪いところ - morishitter blog](http://morishitter.hatenablog.com/entry/2014/11/28/004234)
