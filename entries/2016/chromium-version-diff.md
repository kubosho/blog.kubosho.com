---
title: Chromium のチャンネル間で変更された点を確認する方法
created_at: 2016-05-13
tags: Chromium
---

とある事情により、Chromium の stable と beta チャンネル間で変更された点から、バグが直されたコミットがどれなのか確認する必要に迫られました。
その時どのようにして目的のコミットにたどり着いたのか書いていきます。

## Chromium の各チャンネルのバージョンを確認する

[OmahaProxy - Google Chrome](https://omahaproxy.appspot.com/)というページで確認します。
これは各 OS の Chrome のチャンネルごとに現在のバージョンを表示しているページです。

## Chromium のチャンネル間で変更された点を見る

実際に先ほどのページから stable と beta チャンネル間で変更された点を見てみます。それには画像内でも矢印で指していますが、任意のチャンネルの changelog 部分にある「cr」というリンクをクリックします。

![0bc20858c189ed9d73e3175b253e92df.png](https://qiita-image-store.s3.amazonaws.com/0/7958/a87734fc-be6c-d1ae-ae6c-06a7acd13117.png)

すると、選択したチャンネル（以下の画像では beta チャンネル）の前と現在のバージョンで変更された点が見られます。

![diff.PNG](https://qiita-image-store.s3.amazonaws.com/0/7958/0c09b81d-6aa3-5360-3b90-1d0131f19bb8.png)

ここから stable と beta チャンネル間で変更された点を見るにはアドレスバー上で以下のように URL を書き換えます。

`https://chromium.googlesource.com/chromium/src/+log/:start..:end?pretty=fuller`

たとえば 2016/5/13 現在の stable と beta チャンネル間で変更された点を見たい場合は、`:start`に stable チャンネルのバージョンを`:end`に beta チャンネルのバージョンを入れます。

`https://chromium.googlesource.com/chromium/src/+log/50.0.2661.102..51.0.2704.47?pretty=fuller`

すると、以下のような感じで stable と beta チャンネル間で変更された点を見ることができます。

![diff2.PNG](https://qiita-image-store.s3.amazonaws.com/0/7958/801d9e54-6890-c953-4bc9-c27bbb0b54be.png)

あとはブラウザのページ内検索機能を使い、適当な語句で検索して目的のコミットを見つけるだけです。
