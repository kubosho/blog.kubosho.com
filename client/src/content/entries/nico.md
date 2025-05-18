---
title: Nicoのこれまでとこれから
categories: [技術]
tags: [CSS]
publishedAt: 2015-12-08T00:00:00.000Z
revisedAt: 2025-05-18T12:18:00.000Z
---

[Bootstrap Advent Calendar 2015](http://qiita.com/advent-calendar/2015/bootstrap) 8日目の記事です。
ここではBootstrapのテーマの1つである、[Nico](http://nico.kubosho.com/)のこれまでとこれからについて書きます。

## これまで

まずはNicoができてから、現時点の最新バージョンであるv3.3.6-1.1.0までの軌跡を振り返ります。

はじめにNicoを作ったきっかけとしては、現在冬コミに向けて執筆中の[サイト制作のSTART:DASH!!](https://github.com/o2project/start-dash-of-site-making)という同人誌です。
同人誌の目的上、ラブライブ！のアニメにでてきたラブライブ参加者募集サイトを実際に作る必要がでてきました。
ただ1からCSSを書くのが面倒と感じた自分は、[Honoka](http://honokak.osaka/)をforkし、オリジナルのBootstrapテーマを作ることにしました。

このラブライブ参加者募集サイトですが、図1のアニメ画像キャプチャを見て分かるように配色がピンク系となっています。
配色がピンク系ということは、にこしかいないということで、名前がNicoに決まりました。

しかしHonokaをforkしてできあがったNicoですが、リポジトリーのファイルを見ているうちにいろいろと作業環境を整えたくなりました。
そのためまずは作業環境を整えました。

### 作業しやすくするためのSTART:DASH!!

主にやったことは3つあります。

1つめは、Gruntをなんとなく気分的にグローバルインストールしたくないと思ったため、[npmのrun-scriptでラップしました](https://github.com/kubosho/Nico/commit/57c244d8b8c898efffb45e5e9977222f0a8f6d41)。

2つめは、scssファイルがちゃんとできるか自動で確認したかったので、[Travis CIを導入しました](https://github.com/kubosho/Nico/blob/743aeb2a8e5e102506432dc450e8f2bc8f0efc06/.travis.yml)。

3つめは、Travis CI導入に関係していますが、HonokaだったりNicoの公開用ファイルをgh-pagesブランチに上げる際は手動で上げないといけませんでした。
しかし手動は面倒だと感じたため、[よしなにgh-pagesブランチへpushしてくれるシェルスクリプトを書きました](https://github.com/kubosho/Nico/blob/743aeb2a8e5e102506432dc450e8f2bc8f0efc06/.bin/deploy-to-gh-pages.sh)。

### Nico襲来

これで作業がしやすくなったので、ようやく配色をHonokaからNico仕様にしていきます。
配色を考える上で真姫・凛・花陽・絵里・希のイメージカラーを入れたいと思い、考えた結果次のような配色になりました。
`danger`が紫色になっているのは、希のイメージカラーを入れたいためだったのですが、一応根拠もあります。
それは、天気予報で特別警報の配色が紫色というところから来ています。

| 名前    | カラーコード | 色                                                                      |
| ------- | ------------ | ----------------------------------------------------------------------- |
| default | `#f3d4df`    | <div style="width: 1em; height: 1em; background-color: #f3d4df;"></div> |
| inverse | `#ff50ac`    | <div style="width: 1em; height: 1em; background-color: #ff50ac;"></div> |
| primary | `#ff50ac`    | <div style="width: 1em; height: 1em; background-color: #ff50ac;"></div> |
| success | `#4caf50`    | <div style="width: 1em; height: 1em; background-color: #4caf50;"></div> |
| info    | `#5cfaf9`    | <div style="width: 1em; height: 1em; background-color: #5cfaf9;"></div> |
| warning | `#ff5052`    | <div style="width: 1em; height: 1em; background-color: #ff5052;"></div> |
| danger  | `#ac62ff`    | <div style="width: 1em; height: 1em; background-color: #ac62ff;"></div> |

そして[Nico v3.3.5a](https://github.com/kubosho/Nico/releases/tag/v3.3.5a)をリリースという流れになります。

### なんとかしなきゃ！

リリースした後は、Honokaのバージョン更新に追従していくだけだったのですが、ある時自分の中で事件が起こります。
それは、<a href="http://coliss.com/articles/build-websites/operation/work/best-templates-for-bootstrap-2015-autumn.html" rel="nofollow">商用利用無料！Bootstrap 3, Bootstrap 4をベースに最近のUIデザインのトレンドを取り入れた新作テーマのまとめ | コリス</a>という記事にHonokaと[Umi](https://nkmr6194.github.io/Umi/)は掲載されたのですが、Nicoが掲載されなかったことです。
最初は自分で使うために作ったとはいえ、せっかく作ったし他の人にも使ってほしいと思った自分にとって、ショックを受けた出来事でした。

この時にはHonokaのサイトからNicoがリンクされていたので見てないということはたぶん無いとは思う（と信じたい）のですが、それでも掲載されなかった理由を考えて、配色的に使いづらさがあったという結論に至りました。

特に`info`の色が強すぎること、また`warning`と`danger`の色が元のBootstrapだったり、Honokaとかけ離れているのが原因だったと思います。
そのため、`v3.3.5-1.0.0`より次のような配色にしました。
基本Honokaを踏襲しつつ、モノクロで見たときに`primary`より`success`のほうが色が強くなるよう調整しました。
また`info` &gt; `warning` &gt; `danger`の順に色が強くなっています。

| 名前    | カラーコード | 色                                                                      |
| ------- | ------------ | ----------------------------------------------------------------------- |
| default | `#f3d4df`    | <div style="width: 1em; height: 1em; background-color: #f3d4df;"></div> |
| inverse | `#ff50ac`    | <div style="width: 1em; height: 1em; background-color: #ff50ac;"></div> |
| primary | `#ff64b1`    | <div style="width: 1em; height: 1em; background-color: #ff64b1;"></div> |
| success | `#0faf20`    | <div style="width: 1em; height: 1em; background-color: #0faf20;"></div> |
| info    | `#a27dac`    | <div style="width: 1em; height: 1em; background-color: #a27dac;"></div> |
| warning | `#ff7302`    | <div style="width: 1em; height: 1em; background-color: #ff7302;"></div> |
| danger  | `#f45042`    | <div style="width: 1em; height: 1em; background-color: #f45042;"></div> |

なお`default`と`inverse`も色を変えれば使いやすくなるかもしれませんが、これを変えてしまうとNicoがNicoで無くなってしまうため、変える予定は今のところありません。

## これから

というわけで必要に迫られて作り、いろいろと更新したNicoですが、これからの展望としてはHonokaの変更にできる限り付いていきたいと思います。
なんだかんだでBootstrapは便利ですし、しばらく廃れないと思うので、このNicoやHonokaを通じてBootstrapがどのように進化していくのかを見ていこうと思います。
