---
title: ブログ記事を投稿するためのフォームを作った
categories: [技術]
tags: [React, Lexical, Vite, Vitest, フォーム, microCMS, Zustand, 作ってみた, ブログ]
publishedAt: 2022-07-16T14:36:56.557Z
revisedAt: 2022-11-28T13:54:02.295Z
---

[はてなブログ](https://hatenablog.com/)のMarkdownによる記事編集画面や[esa - 自律的なチームのための情報共有サービス](https://esa.io/)のように、本文の編集画面とリアルタイムプレビューが横並びになるような投稿フォームが個人的に好みです。

ですが、ブログで使っている[microCMS](https://microcms.io/)の投稿画面や、普段使っているマークダウンエディターの[Obsidian](https://obsidian.md/)にはプレビューを横並びにするようなオプションが無かったため、自分で記事を投稿するためのフォームを作ってみました。

技術スタックとしては次の通りです。仕事では使っていないものばかりですが、いろいろ使ってみたかったものを揃えてみました。

- [Lexical · An extensible text editor framework that does things differently](https://lexical.dev/)
- [Headless UI - Unstyled, fully accessible UI components](https://headlessui.com/)
- [Vite | 次世代フロントエンドツール](https://ja.vitejs.dev/)
- [Vitest | A blazing fast unit test framework powered by Vite](https://vitest.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

実際の記事投稿画面は次の通りです。

![記事の投稿フォームのスクリーンショット](https://blog-assets.kubosho.com/instant-blog-post-form.png)

## 備えている機能

今回作った投稿フォームの特徴は次の通りです。

- ページの左側に本文編集フォームがある
- ページの右側にリアルタイムプレビューがある
- 下書き状態・公開状態の切り替えが可能
  - ただmicroCMSはPOST APIにクエリーを付けたい場合は[Teamプラン](https://microcms.io/pricing)以上の契約が必要になる……（作った後の動作確認で気づいた）
- ページを再読み込みしてもタイトル・URLのパス・本文の状態が保持される

## これから作りたい機能

いま考えていることとして、次に挙げる機能を作りたいと思っています。

- 記事を投稿するときに確認画面を表示する
- 記事の投稿が完了したら完了と分かるような表示を追加する
- 記事の投稿に失敗したら失敗と分かるような表示を追加する
- タグの追加ができる
- カテゴリーの追加ができる
- プレビュー画面のスタイルを[https://blog.kubosho.com/](https://blog.kubosho.com/)と同じものを適用する
- [fukayatsu/esarea](https://github.com/fukayatsu/esarea)やesaの本文編集フォームのように、tabキーやenterキーを押したときにマークダウンの記法が自動で挿入される
- [textlint · The pluggable linting tool for text and markdown](https://textlint.github.io/)を導入して、記事を書いているときにエラーを出す
- 何かしらのホスティングサービスにアップロードして、いろんなデバイスからアクセスできるようにする
  - 認証機能を作る必要がある
- 本文編集部分とプレビュー部分のスクロール同期をする
- Vimモード
- 画像アップロード

## まとめ

もしこの記事を見て良いなと思ったら、リポジトリへのstarとwatch登録お願いいたします。

[kubosho/instant-blog-post-form: Blog post form for https://blog.kubosho.com.](https://github.com/kubosho/instant-blog-post-form)
