---
title: 個人の技術ブログをリニューアルした
categories: [技術]
tags: [ブログ, 作ってみた]
publishedAt: 2025-12-28T12:00:00.000Z
revisedAt: 2025-12-30T14:00:00.000Z
---

個人の技術ブログ（今あなたが見ているブログ）をリニューアルしました。

見た目はそこまで変わっていないですが、内部はいろいろと構成を見直したり機能を追加したりしました。

## システム構成の変更

以前は、Next.jsベースでブログを作り、microCMSから記事を入稿し、Vercelでホスティングしていました。その時のシステム構成は[Next.js + Vercel + microCMSなどを使ってほぼ無料でブログを運用する](https://blog.kubosho.com/entries/my-blog-architecture)で書いています。

しかし、いくつか問題がありました。

- 静的コンテンツが多いブログに対して、Next.jsがオーバースペック
- CMSで管理したくなるほどコンテンツ管理が複雑化していない。やはりオーバースペック
- Vercelにロックインされるのが、なんとなく嫌だった

そのため、現在はAstroで大部分のコンテンツをSSGするようにして、[専用のリポジトリ](https://github.com/kubosho/articles)で記事を管理し、Cloudflare Workersでホスティングしています。

なおロックインという観点では、Cloudflareの機能にだいぶ依存しているので、依存先が変わっただけと言えます。ロックイン解消という観点では移行した意味がないですね。

## いいねボタンの設置

noteのいいねボタンや、[catnose's notes](https://catnose.me/notes)の拍手ボタンに触発されて、読者が簡易的なフィードバックを送れる手段として設置しました。

最近はnoteで[日々の心がけ](https://note.com/kubosho_/m/mef4952821660)といった記事を書くことが増えています。noteはいいねの数がPV以外の指標として分かりやすく、記事が読まれている実感を得られる点が良いです。下衆な話をすれば、承認欲求が満たされるとも言います。

そういった体験を自分のブログでも得たくなったのが開発のきっかけでした。

### いいねボタンの技術的な話

APIの実装にはAstroの[Server Endpoints](https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes)を使用しています。

GETリクエストは[Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)でキャッシュして、Cloudflareの[Edge and Browser Cache TTL](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/)のデフォルト値を適用しています。

キャッシュのinvalidationはPOSTリクエスト時の `cache.delete()` で実現していて、キャッシュヒット率向上のためにクエリパラメータを削除したURLをキーにしています。

POSTリクエストに対しては、[Rate Limiting API](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)で一定のレートリミットもかけています。アクセス数は多くないので不要そうですが、攻撃対策として一応入れています。

いいね数は[Neon](https://neon.com/)上のデータベースに保存しています。Neonは無料枠の存在が嬉しいですが、もし無料枠がなくなったら移行するかもしれません。

またリクエストのバリデーションに[Valibot](https://valibot.dev/)を使っています。Astroでは `astro/z` を介して[Zod](https://docs.astro.build/en/reference/modules/astro-zod/#z)が使えることをAstro v5へ更新したときに知りましたが、開発を一段落させることを優先してValibotをひとまず使うことにしました。

## シェアボタンの設置

以前は、SNSの喧噪と距離を置くため意図的に設置していませんでした。

しかし、記事をより多くの人に見てほしいという欲が出てきたのでシェアボタンを設置しました。シェアボタンを設置することによって、すぐにシェアが増加して承認欲求が満たされてウハウハ！とはならないですが、まずは設置することが重要と考えました。

## いろいろと試せる場があると楽しい

個人の技術ブログは自分の好きなようにできますし、やりたいことをやる気になったらすぐ試せます。いろいろあーでもないこーでもないと格闘できるのが楽しいです。

そういった場の存在を保つためにも、この個人の技術ブログを無くすことはないでしょう。

---

なお、実装がどうなっているのか見たい方は、ソースコードを[kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com)に置いているので見てください。
