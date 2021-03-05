---
title: Twitterの右サイドバーを非表示にする
created_at: 2021-03-06
categories: 技術
tags: CSS, Stylus, Twitter
---

個人的に Twitter のトレンドに上がっているものを見たときに、イラつきを覚えるようになってきました。
そんなにイラつきを覚えるようなら見なければいいという話はありますが、次のツイートにある通り、ある意味で期待通りの報酬を得られる行為になっています。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">インターネットでQOLを1番下げる行為は、間違いなく「嫌いな人間/集団/コンテンツを自分から見に行って、嫌なものを見つけて、嫌なのを確認する」事なんだけど、これはある意味で「期待通りの報酬を得られる」行為なので、常習化を招きやすいんだよな。人生には得てはいけない成功体験があるというな。</p>&mdash; rei@生きてるだけで疲労困憊発売延期 (@rei10830349) <a href="https://twitter.com/rei10830349/status/1178553747770753025?ref_src=twsrc%5Etfw">September 30, 2019</a></blockquote>

そのため Twitter のトレンドを見てしまうことが多く、トレンドを見るたびに後悔していました。

## Twitter の右側を視界から消す

普段見ている Twitter の画面はこんな感じだと思います。
左サイドバーにナビゲーションがあって、中央にツイート一覧、そして右サイドバーに Twitter 内の回遊リンク一覧がある構成になっています。

![CSSを調整する前のTwitterは3カラムになっている](https://res.cloudinary.com/kubosho/image/upload/c_scale,w_1000/v1614962037/twitter_home_before_xivyff.png)

この構成だと右サイドバーの Twitter 内の回遊リンク一覧が目に入ります。特にいまどうしてる？というタイトルが付けられた Twitter 内のトレンド一覧が目に入ります。
そう、Twitter 内のトレンドが割と目に入りやすいのです。

ならばと思い、絶対目に入らないように[Stylus](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=ja)上で CSS を書いて Twitter の右サイドバーを非表示にしました。

Twitter では次のツイートにある通り、React Native for Web を使っています。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you use Twitter Lite you&#39;re now using a web app rendered by React Native for Web</p>&mdash; Nicolas (@necolas) <a href="https://twitter.com/necolas/status/913877194199359488?ref_src=twsrc%5Etfw">September 29, 2017</a></blockquote>

これは今も変わってなさそうで、HTML に定義されているクラス名はランダムな文字列となっています。
そのため Stylus などのユーザー側で書いた CSS を注入するときは `data-*` 属性のセレクタに対してスタイル定義をするのが、将来的に壊れにくくなりそうという考えのもと、書いた CSS は次の通りです。

```css
[data-testid='primaryColumn'] {
  max-width: 600px;
}

[data-testid='sidebarColumn'] {
  display: none;
}
```

この CSS を適用した Twitter を見てみましょう。見事に今回の目的である右サイドバーを非表示にできています。

![CSSを調整した後のTwitterは2カラム表示になっている。右サイドバーは非表示になっている](https://res.cloudinary.com/kubosho/image/upload/c_scale,w_1000/v1614962037/twitter_home_after_m8kg5y.png)

## まとめ

本来なら Twitter のアカウントを削除して何もかも見れなくしたほうが良いと思います。

ただ他サービスのログインに使っていたり、DM でやり取りしている人がいたりとやめるにやめられない状況があるため、今回は妥協案として右サイドバーを非表示にしました。

Twitter には有料機能でもいいのでトレンドなどを削除する機能を作ってほしいです。
