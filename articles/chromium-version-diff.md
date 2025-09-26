---
title: Chromium のチャンネル間で変更された点を確認する方法
excerpt: とある事情により、Chromium の stable と beta チャンネル間で変更された点から、バグが直されたコミットがどれなのか確認する必要に迫られました。
categories: [技術]
tags: [Chromium]
publishedAt: 2016-05-13T00:00:00.000Z
revisedAt: 2022-11-28T15:34:06.007Z
---

とある事情により、Chromiumのstableとbetaチャンネル間で変更された点から、バグが直されたコミットはどれなのか確認する必要に迫られました。
その時どのようにして目的のコミットにたどり着いたのか書いていきます。

## Chromium の各チャンネルのバージョンを確認する

[OmahaProxy - Google Chrome](https://omahaproxy.appspot.com/)というページで確認します。
これは各OSのChromeのチャンネルごとに現在のバージョンを表示しているページです。

## Chromium のチャンネル間で変更された点を見る

実際に先ほどのページからstableとbetaチャンネル間で変更された点を見てみます。それには画像内でも矢印で指していますが、任意のチャンネルのchangelog部分にある「cr」というリンクをクリックします。

![Chromiumの各チャンネルの情報を表示している画面](https://blog-assets.kubosho.com/chrome_version.png)

すると、選択したチャンネル（以下の画像ではdevチャンネル）の前と現在のバージョンで変更された点が見られます。

![Chromiumのstableチャンネルとdevチャンネルの差分を表示している画面](https://blog-assets.kubosho.com/chrome_stable_dev.png)

ここからstableとdevチャンネル間で変更された点を見るにはアドレスバー上で以下のようにURLを書き換えます。

`https://chromium.googlesource.com/chromium/src/+log/:start..:end?pretty=fuller`

たとえば2021/3/6現在のstableとdevチャンネル間で変更された点を見たい場合は `:start` にstableチャンネルのバージョンを `:end` にdevチャンネルのバージョンを入れます。

`https://chromium.googlesource.com/chromium/src/+log/50.0.2661.102..51.0.2704.47?pretty=fuller`

すると、以下のような感じでstableとbetaチャンネル間で変更された点を見ることができます。

![Chromiumのチャンネル間の更新差分を表示している画面](https://blog-assets.kubosho.com/chrome_diff.png)

あとはブラウザのページ内検索機能を使い、適当な語句で検索して目的のコミットを見つけるだけです。
