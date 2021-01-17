---
title: ブログ v5.0.0
created_at: 2021-01-17
categories: 技術
tags: ブログ
---

年末年始から継続してこのブログの改修をおこなっています。
年末年始の前は[v2.5.0](https://github.com/kubosho/blog.kubosho.com/releases/tag/v2.5.0)が最新でしたが、現在は[v5.0.0](https://github.com/kubosho/blog.kubosho.com/releases/tag/v5.0.0)までバージョンが上がっています。

[Releases · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/releases)
この記事では v2.5.0 から v5.0.0 までの主要な更新を紹介していきます。

## v2.6.0

[Release v2.6.0 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/releases/tag/v2.6.0)

styled-component を使うのをやめて、[Next.js でサポートしている CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support)を使うようにしました。
styled-components をやめた理由は次の通りです。

- まずコンポーネントを定義してそこからスタイルを定義していくことが、どうにも馴染めなかったこと
- CSS をそのまま書いたほうがツールとの相性が良いこと

## v3.0.0

[Release v3.0.0 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/releases/tag/v3.0.0)

プライバシーポリシーと題していたページを[ポリシー](https://blog.kubosho.com/policy)と称するようにしました。
それに伴ってパスの名前を `/privacy` から `/policy` に変更しています。

今まではプライバシーポリシーだけを書いていましたが、Amazon アソシエイトのことや免責事項を書きたくなったので、ページの名前とパスを変えました。

## v3.13.0

[Release v3.13.0 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/releases/tag/v3.13.0)

[フォーカスのスタイルを改善](https://github.com/kubosho/blog.kubosho.com/commit/ee34efd2d5b06187db7f33fe5e877e32fd5f1f52)しました。

[Front-End Study #3「『当たり前』をつくりだす Web アクセシビリティ」 - connpass](https://forkwell.connpass.com/event/198726/)を見ていたら、フォーカスのスタイルについて話があったのですが、自分のブログを見返したところ Safari でフォーカス時のスタイルが適用されてなくて `outline` が表示されないことに気づいたので直しました。

### 関連リンク

- [:focus-visible - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/:focus-visible#selectively_showing_the_focus_indicator)

## v4.0.0

[Release v4.0.0 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/releases/tag/v4.0.0)

ブログのフィードの本文を今までは部分的な配信にしていましたが、全文を配信するように変更しました。
部分配信にしていた理由としては、ブログに訪問させてアクセス解析の対象としたいということだったり、今後広告を表示したときに広告をクリックしてほしいという気持ちがあった気がします（あやふや）。

ただ全文配信のほうがさまざまな環境で読めてよりアクセシブルになりそうという考えを持ったのと、自分自身 Feedly でフィードを読んでいたときに全文配信されていないと嫌だなと思ったのを思い出したので、全文配信するように変更しました。

[BREAKING CHANGE: deliver to full text on feed reader by kubosho · Pull Request #603 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/pull/603)

変更自体は 1 行変更しただけの楽な変更ですが、部分配信から全文配信に変更することで互換性はなくなるのではと思い、breaking change 扱いにしています。

### 関連リンク

- [RSS 全文配信/部分配信:Geek なぺーじ](https://www.geekpage.jp/web/blogging-theory/rss-all-part.php)
- [RSS フィードの全文配信と部分配信 | トレンドウォッチ | デジパ株式会社](https://digiper.com/topics/article/187.shtml)

## v5.0.0

[Release v5.0.0 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/releases/tag/v5.0.0)

ブログのフィードの配信フォーマットを RSS 2.0 から Atom に変更しました。

[Change feed format from RSS 2.0 to Atom by kubosho · Pull Request #604 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/pull/604)

自分自身はずっとフィードを Atom で配信していると思いこんでいたのですが、よく見たら RSS2.0 のフォーマットになっていてビックリしました。
幸いにも[W3C Feed Validation Service, for Atom and RSS](https://validator.w3.org/feed/)で valid にはなっていたので、フィード配信には問題なかったと思います。それはそうと思い込みは怖いですね。

## まとめ

今年は、ブログ自体の更新だけでなく、ブログの記事もたくさん書いていきたいなあという気持ちです。
