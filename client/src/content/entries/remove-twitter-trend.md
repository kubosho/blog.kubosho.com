---
title: Twitterの右側サイドバーを消す
excerpt: Twitter のトレンドを見ると、イラつきを覚えるようになりました。そんなにイラつきを覚えるようなら見なければいいし、そもそも Twitter やめろという話はあります。
categories: [技術]
tags: [CSS, Twitter]
publishedAt: 2021-03-06T00:00:00.000Z
revisedAt: 2022-11-28T16:44:31.940Z
---

Twitterのトレンドは見るたびにイラつきを覚えます。そんなにイラつきを覚えるようなら見なければいいし、そもそもTwitterをやめろという話かもしれません。

ただ次のツイートにあるようにある意味で期待通りの報酬を得られる行為となります。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">インターネットでQOLを1番下げる行為は、間違いなく「嫌いな人間/集団/コンテンツを自分から見に行って、嫌なものを見つけて、嫌なのを確認する」事なんだけど、これはある意味で「期待通りの報酬を得られる」行為なので、常習化を招きやすいんだよな。人生には得てはいけない成功体験があるというな。</p>&mdash; rei@生きてるだけで疲労困憊発売延期 (@rei10830349) <a href="https://twitter.com/rei10830349/status/1178553747770753025?ref_src=twsrc%5Etfw">September 30, 2019</a></blockquote>

そのためTwitterのトレンドを見てしまうことが多くトレンドを見るたびに後悔していました。ただやめられなくなっていて正直なところ常習化していました。

## なぜTwitterのトレンドを見てしまうのか

TwitterのページをWeb上で見ると自然とトレンドが目に入ってきます。普段見ているTwitterの画面は画像の通りだと思います。

![CSSを調整する前のTwitterは3カラムになっている](https://blog-assets.kubosho.com/twitter_home_before.png)

左サイドバーにナビゲーション、中央にツイート一覧、そして右サイドバーにTwitter内の回遊リンク一覧がある構成です。

この構成だと右サイドバーのTwitter内の回遊リンク一覧が目に入ります。特に「いまどうしてる？」というタイトルが付けられたTwitter内のトレンド一覧が目に入ります。

これはTwitter側でトレンドを見てもらうことでTwitter内を回遊してくれて、結果としてTwitter内で追っているKPIを達成できるというデータがあるのでしょう。なので目に入る位置にトレンドがあるのと、トレンドの先頭は広告枠になっているのだと思います。

ただTwitterのトレンドを目に入れたくない立場からすればとにかく消えてほしいものです。あとついでにおすすめユーザーも邪魔な気がしてきました。

## Twitterのトレンドを視界から消す(ついでにおすすめユーザーも)

ということでTwitterのトレンドを視界から消します。

今回は[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=ja)を使って、Twitter側で定義されているCSSを上書きしてTwitterのトレンドのみならず右サイドバーごと非表示にしました。

なおTwitterのトレンドを消す方法として、Chrome向けのTwitter拡張機能である[おだやかTwitter](https://chrome.google.com/webstore/detail/calm-twitter/cknklikacoaeledfaldmhabmldkldocj?hl=ja)や[Simplified Twitter](https://chrome.google.com/webstore/detail/simplified-twitter/kfopmjhmejbgomgeajemgpgpbckpoopg/related)を入れる方法や、[地域を変更してトレンドのみ表示できないようにする](https://www.tsukutarou.net/entry/Twitter-Trend-Shutout)方法もあります。

### Twitterの右サイドバーを削除するときの課題と解決方法

TwitterはReact Native for Webを使っています。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you use Twitter Lite you&#39;re now using a web app rendered by React Native for Web</p>&mdash; Nicolas (@necolas) <a href="https://twitter.com/necolas/status/913877194199359488?ref_src=twsrc%5Etfw">September 29, 2017</a></blockquote>

これは今も変わってなさそうでHTMLに定義されているクラス名はランダムな文字列です。

このためクラス名を元にスタイル定義をすると、将来の変更でスタイルが適用されなくなりそうです。

そのためStylus上で `data-*` 属性のセレクタに対してスタイル定義をすれば将来的に壊れにくくなりそうという考えを持ちました。これに従って書いたCSSは次の通りです。

```css
[data-testid='primaryColumn'] {
  max-width: 600px;
}

[data-testid='sidebarColumn'] {
  display: none;
}
```

このCSSを適用したTwitterのスクリーンショットを見てみましょう。

![CSSを調整した後のTwitterは2カラム表示になっている。右サイドバーは非表示になっている](https://blog-assets.kubosho.com/twitter_home_after.png)

見事にTwitterの右サイドバーを非表示にできています。今回の目的を達成しました。

## まとめ

正直Twitterを見ないようにしたりアカウントを削除して何もかも見れなくしたりしたほうが手っ取り早いです。

しかし他サービスのログインに使っていたり、DMでやり取りしている人がいたり、拡散される役目をTwitterに依存しがちだったり、いろいろやめられない状況でした。なので今回は妥協案として右サイドバーを非表示にしました。

Twitter Blueにトレンドなどを削除する機能を作ってほしいですが、広告枠の扱いなども考えると難しそうです。
