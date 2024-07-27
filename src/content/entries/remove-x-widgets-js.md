---
title: Xのwidgets.jsの読み込みをやめた
categories: [技術]
tags: [JavaScript, Twitter, X]
publishedAt: 2024-07-27T00:00:00.000Z
---

このブログでは単体記事の読み込み時にXが提供しているwidgets.jsを読み込むようにしていました。

しかしいくつかの理由によって読み込むのをやめました。

## CLS (Cumulative Layout Shift) のスコアが悪くなる

[Cumulative Layout Shift（CLS）  |  Articles  |  web.dev](https://web.dev/articles/cls?hl=ja)

デスクトップで計測した場合、[2020年の F1 の振り返りと2021年の F1 に期待すること](https://blog.kubosho.com/entries/f1-2020-and-f1-2021/)の記事では「0.068」で、[Twitterの右側サイドバーを消す](https://blog.kubosho.com/entries/remove-twitter-trend/)の記事では「0.028」でした。モバイルで計測した場合、[2020年の F1 の振り返りと2021年の F1 に期待すること](https://blog.kubosho.com/entries/f1-2020-and-f1-2021/)の記事では「0」となりますが、[Twitterの右側サイドバーを消す](https://blog.kubosho.com/entries/remove-twitter-trend/)の記事では「0.12」とNeeds improvementの領域に入ってきます。

デバイスやXのポストを引用する位置によって、CLSスコアがNeeds improvementの領域に入るのは考えることが増えるので嫌です。

## JavaScriptのparseとevaluationにかかる時間が多少長い

- PC: MacBook Pro 14インチ (2021)
- CPU: Apple M1 Max
- メモリ: 64GB
- ブラウザー: Google Chrome v126.0.6478.183

## JavaScriptのサイズがでかい

- https://platform.twitter.com/widgets.js (28.2 KB)
- https://platform.twitter.com/widgets/widget_iframe.{ハッシュ値}.html?origin={サイトのURL} (106 KB)

一度読み込んでしまえばDisk cacheが効くとはいえ、
