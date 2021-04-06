---
title: Twitterの右サイドバーを非表示にする
created_at: 2021-03-06
categories: 技術
tags: CSS, Stylus, Twitter
---

Twitter のトレンドを見ると、イラつきを覚えるようになりました。そんなにイラつきを覚えるようなら見なければいいし、そもそも Twitter やめろという話はあります。
ただ次のツイートにある通り、ある意味で期待通りの報酬を得られる行為で、正直なところ常習化していました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">インターネットでQOLを1番下げる行為は、間違いなく「嫌いな人間/集団/コンテンツを自分から見に行って、嫌なものを見つけて、嫌なのを確認する」事なんだけど、これはある意味で「期待通りの報酬を得られる」行為なので、常習化を招きやすいんだよな。人生には得てはいけない成功体験があるというな。</p>&mdash; rei@生きてるだけで疲労困憊発売延期 (@rei10830349) <a href="https://twitter.com/rei10830349/status/1178553747770753025?ref_src=twsrc%5Etfw">September 30, 2019</a></blockquote>

そのため Twitter のトレンドを見てしまうことが多く、トレンドを見るたびに後悔していました。

## Twitter のトレンドが目に入ってくる

Twitter のページを見ると自然とトレンドが目に入ってきます。
普段見ている Twitter の画面は次の通りだと思います。

![CSSを調整する前のTwitterは3カラムになっている](https://blog-assets.kubosho.com/twitter_home_before.png)

左サイドバーにナビゲーションがあって、中央にツイート一覧、そして右サイドバーに Twitter 内の回遊リンク一覧がある構成になっています。

この構成だと右サイドバーの Twitter 内の回遊リンク一覧が目に入ります。
特にいまどうしてる？というタイトルが付けられた Twitter 内のトレンド一覧が目に入ります。

これは Twitter 側で、トレンドを見てもらうことで Twitter 内を回遊してくれて、結果として追っている KPI を達成できる確率が高まるというデータがあるのでしょう。
なので一番目に入る位置にトレンドがありますし、トレンドの先頭は広告枠になっているのだと思います。

## Twitter のトレンドを視界から消す

そんな Twitter のトレンドを視界から消すために、[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=ja)を使って、Twitter 側で定義されている CSS を上書きし、Twitter のトレンドを非表示にしました。

### トレンドを削除するときの課題

Twitter では次のツイートにある通り、React Native for Web を使っています。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you use Twitter Lite you&#39;re now using a web app rendered by React Native for Web</p>&mdash; Nicolas (@necolas) <a href="https://twitter.com/necolas/status/913877194199359488?ref_src=twsrc%5Etfw">September 29, 2017</a></blockquote>

これは今も変わってなさそうで、HTML に定義されているクラス名はランダムな文字列となっています。
このためクラス名を元にスタイル定義をすると、将来の変更でスタイルが適用されなくなることが容易に想像できます。

#### 解決策

そのため自分が書いた CSS を注入する際 `data-*` 属性のセレクタに対してスタイル定義をすれば、将来的に壊れにくくなりそうという考えを持ちました。
それに従って書いた CSS は次の通りです。

```css
[data-testid='primaryColumn'] {
  max-width: 600px;
}

[data-testid='sidebarColumn'] {
  display: none;
}
```

この CSS を適用した Twitter を見てみましょう。見事に今回の目的である右サイドバーを非表示にできています。

![CSSを調整した後のTwitterは2カラム表示になっている。右サイドバーは非表示になっている](https://blog-assets.kubosho.com/twitter_home_after.png)

## まとめ

本来なら Twitter を見ないようにしたり、アカウントを削除して何もかも見れなくしたりしたほうが手っ取り早いでしょう。

ただ他サービスのログインに使っていたり、DM でやり取りしている人がいたり、そもそも Twitter に割と依存しがちだったりとやめられない状況です。
なので今回は妥協案として、右サイドバーを非表示にしました。

Twitter には有料機能でもいいので、トレンドなどを削除する機能を作ってほしいですが、それが叶うことはないでしょう……
