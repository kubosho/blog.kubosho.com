---
title: Next.js + Vercel + microCMSなどを使ってほぼ無料でブログを運用する
categories: [技術]
tags: [microCMS, 作ってみた, Vercel, Next.js, ブログ, CMS]
publishedAt: 2022-08-24T10:26:59.603Z
revisedAt: 2022-11-28T15:39:57.855Z
---

当ブログのシステム構成について紹介します。構成を真似することでほぼ無料（後述）でブログを運営できます。

## 当ブログの構成概要

いわゆるJamstack構成です。構成を画像で示すと次の通りです。

![ブログの構成を表した図](https://blog-assets.kubosho.com/blog_system_diagram.png)

microCMSまたは[ブログのリポジトリ](https://github.com/kubosho/blog.kubosho.com)に変更がある場合、Vercelの[Deploy Hooks](https://vercel.com/docs/concepts/git/deploy-hooks)を使ってVercel上の環境を更新するようにしています。

Next.js上でビルドするときに、ヘッドレスCMSのAPIを使ってブログの記事などを取得し、[Next.js](https://nextjs.org/)の[getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)を使ってStatic Site Generateをできるようにしています。

ブログのコンテンツは[Vercelが提供しているCDN](https://vercel.com/docs/concepts/edge-network/overview)によってキャッシュされます。

また画像などはAmazon S3上にアップロードしたものを、CloudFrontでキャッシュして配信するようにしています。

## どうしてブログをJamstack構成で作ろうと思ったか

もともとこのブログは[はてなブログ](https://hatenablog.com/)上で書かれていました。

はてなブログを使っていた理由としては、WordPressなどのCMSを使った場合に、本体やプラグインの更新管理が面倒だったのと、投稿画面が使いやすかったためでした。

### 素振り環境が欲しくなった

はてなブログでブログを運用するうちに、Webフロントエンドやサーバーサイドも含めた素振り環境が欲しくなりました。

そうした思いと、はてなブログProで提供されている機能のうち独自ドメインくらいしか恩恵を受けていないことに気づき、ブログを自前で作ろうと思い立ちました。

そこでブログを作り出した当初は、サーバーサイドも含めて作っていました。

ただ作業する中でいつまで経っても完成しない未来が見えたので、サーバーサイド側を作りこむのは諦め、Next.jsを使ってさくっと作って公開することにしました。

## どのような技術スタックになっているか

使っているサービスやフレームワーク・ライブラリーを表にしました。

| 技術                     | リンク                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| フレームワーク           | [Next.js](https://nextjs.org/)                                      |
| ヘッドレスCMS            | [microCMS](https://microcms.io/)                                    |
| ホスティング             | [Vercel](https://vercel.com/)                                       |
| 画像ストレージ           | [Amazon S3](https://aws.amazon.com/jp/s3/)                          |
| 画像CDN                  | [CloudFront](https://aws.amazon.com/jp/cloudfront/)                 |
| i18n                     | [Rosetta](https://github.com/lukeed/rosetta)                        |
| マークダウンプロセッサー | [unified](https://unifiedjs.com/), [remark](https://remark.js.org/) |
| HTMLコンバーター         | [rehype](https://github.com/rehypejs/rehype)                        |
| テスト                   | [Vitest](https://vitest.dev/)                                       |

この中からヘッドレスCMSの変遷について話します。

### 最初はヘッドレスCMSにContentfulを使った

はてなブログからNext.jsベースのブログに置き換えたとき、[Contentful](https://www.contentful.com/)を使っていました。

しかし[自動保存のタイミングでIMEが確定されて書いた記事の文章がめちゃくちゃになる現象](https://blog.kubosho.com/entry/migrating-from-contentful-to-markdown-file)に遭遇して、ContentfulからGitリポジトリにMarkdownファイルをコミットして、事前に記事の情報をまとめたJSONファイルを作る形式に変更しました。

### Markdownファイルをコミットする形式からmicroCMSへの移行

なんで移行しようと思ったかは覚えていないですが、6時間くらいかけてmicroCMSに記事を移行できたようです。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">だいたい 6 時間くらいでブログのシステムを Markdown を直接更新する形式から microCMS で記事を入稿する形式にできた</p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1452620689240780802?ref_src=twsrc%5Etfw">October 25, 2021</a></blockquote>

## どれほどの料金がかかるか

今年実際にかかった料金を表にしました。

| 名前       | プラン      | 料金      |
| ---------- | ----------- | --------- |
| microCMS   | Hobbyプラン | ￥0       |
| Vercel     | Hobbyプラン | ￥0       |
| Amazon S3  | 従量課金    | ￥0       |
| CloudFront | 従量課金    | $0～$0.01 |

## 今後どうしていきたいか

最後に当ブログの展望を示します。

### OGP imageの自動生成

現在は記事がSNSなどにシェアされた場合、固定の画像が表示されます。

これを多くのCGMサービスで導入されているように、ブログのテーマに沿った画像を自動生成して使うようにしたいと考えています。

### デバフの導入

今はサードパーティースクリプトなどが少ないので表示速度が早いですが、広告のスクリプトやWebフォントなどを導入してそれでもなお表示速度が早いというブログにしたいと考えています。

ただVercelのhobbyプランは広告を扱うと商用利用扱いになって[Proプラン以上の契約が必要](https://vercel.com/docs/concepts/limits/fair-use-policy#commercial-usage)になります。なので広告のスクリプトを導入する場合はVercelのProプラン以上を契約するか、商用利用可のホスティングサービスに移動する必要があります。

### ブログのパフォーマンス指標の継続的な測定

広告のスクリプトやWebフォントの導入に伴って、パフォーマンス指標の継続的な測定を何かしらでして、パフォーマンス向上施策がどのくらい効果あるのか見られるようにしたいと考えています。

### Googleアナリティクスの活用

今はただGoogleアナリティクスを導入しているだけですが、コンバージョンの設定なども入れてPV数などを上げるための参考指標を作りたいと考えています。

### 継続的にブログ更新できる仕組みづくり

なるべくブログの記事投稿を楽にしようと思い、ブログの投稿フォームや画像アップローダーを作っています。

- ブログの投稿フォーム - https://github.com/kubosho/instant-blog-post-form
- 画像アップローダー - https://github.com/kubosho/s3-image-uploader

## 最後に

この記事が参考になったらブログのリポジトリにスターお願いします！

[kubosho/blog.kubosho.com: My personal blog. Built with Jamstack technology stack.](https://github.com/kubosho/blog.kubosho.com)
