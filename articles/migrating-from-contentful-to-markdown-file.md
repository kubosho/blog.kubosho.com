---
title: ブログの記事管理をContentfulからGitリポジトリに変更した
excerpt: このブログは最初はてなブログで書いていて、1 年前にこっそり Next.js + Contentful という仕組みに変えて運用していた。
categories: [技術]
tags: [GitHub, CMS, Git]
publishedAt: 2020-05-18T00:00:00.000Z
revisedAt: 2022-11-28T15:38:42.969Z
---

このブログは最初はてなブログで書いていて、1年前にこっそりNext.js + Contentfulという仕組みに変えて運用していた。今回仕組みをふたたび変えて、MarkdownファイルをGitリポジトリにコミットしていく形式にした。

コミットしたMarkdownファイルはGitHub上へpushするとVercelのGitHub integrationによってVercel上にデプロイされる仕組みとなっている。その辺の仕組みについてコードを読みたい人は [entryConverter.ts](https://github.com/kubosho/kubosho.com/blob/master/src/entry/entryConverter.ts) と [entriesJsonBuilder.ts](https://github.com/kubosho/kubosho.com/blob/master/tools/entriesJsonBuilder.ts) を読むと良い。

## なぜ Contentful から Markdown ファイルを編集する形式に変えたのか

理由は3つある。

### 1. Contentful の Markdown エディタの挙動が信用できなくなった

[リモートワーク体制になって変わったこと・変わらなかったこと](https://blog.kubosho.com/entry/working-style-after-covid-19)の記事を書いていたときに、下記の事象に遭遇した。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Contentfulのエディタで記事を書いていたら自動保存のタイミングでIMEが確定されていたようで、文章がめちゃくちゃになっていた。そしてその状態がエディタに表示されてなかったので、何も対策できなかった…<a href="https://t.co/IDBnTnzZf6">https://t.co/IDBnTnzZf6</a></p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1253014495930118146?ref_src=twsrc%5Etfw">April 22, 2020</a></blockquote>

[Contentful Community](https://www.contentfulcommunity.com/t/can-i-disable-auto-save-in-the-content-posting-editor/2626) にも同様の問題が報告されていた。Markdownエディタを使ってフルスクリーン状態で記事を書いていたらこの問題が発生した。後日問題が再現するか試したが、再現しなかったので複合的な要因でバグる可能性が考えられる。

とはいえ、記事を書くときに「記事ちゃんとした形で保存されているのかな…」といった余計な思考が混ざることで記事を書くことを億劫にさせるし、安定した環境で書きたくなった。

### 2. Contentful の 編集画面が気に食わない

ブログ記事を書くときに自分は本文部分とプレビュー部分をそれぞれ横並びに表示したい。どういうことかは次に示すはてなブログの編集画面の画像を見てもらうと分かる。

![はてなブログの編集画面は本文とプレビューで2カラムになっている](https://blog-assets.kubosho.com/hatena-blog-editor.png)

だがContentfulの編集画面は1カラムになっている。次に示すContentfulの編集画面の画像を見てもらうと分かるように自分の理想とするレイアウトになっていない。

![Contentfulの編集画面は1カラムになっていて余計な空白が空いているため使いづらい](https://blog-assets.kubosho.com/contentful-editor.png)

一応Contentful上のContent modelから本文のエディタをMarkdownエディタにしたうえでフルスクリーンモードにすると、編集画面とプレビュー画面が横並びに表示されるようにはなる。ただこの表示にすると、先ほど書いたように本文がとんでもないことになることがあるので詰んでしまう。

またMarkdownエディタにした場合、エディタ部分のfont-familyに `font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace!important;` が指定されているため、特にWindows環境だと文章を書く気力を失う見た目になる。

![ContentfulのMarkdownエディタの画面](https://blog-assets.kubosho.com/contentful-markdown-editor.png)

### 3. 思ったよりいろんな環境でブログの記事を書かない

いつどこでもブログの記事を書けるようにしたいがWordPressは導入が面倒だなと思って、裏側をHeadless CMSひいてはContentfulにしてみたものの、スマホやタブレットでブログの記事を書くことはなかった…

実際に運用してみたらほぼパソコンからしか記事を書いていなかったので、だったら使い慣れたテキストエディタ上で記事を書けたほうが筆は進むのではと思い、移行に至った。

実際この記事も使い慣れたVisual Studio Code上で書いているが、使い慣れているだけあって頭のリソースを100%文章に向けられている。これで良かった。

## まとめ

ちゃんとユースケースを考えよう。
