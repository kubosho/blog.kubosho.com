---
title: Web Speed Hackathon 2026参加記
categories: [技術]
tags: [ハッカソン, パフォーマンス]
publishedAt: 2026-03-20T03:00:00.000Z
revisedAt: 2026-03-20T03:00:00.000Z
---

3月20日から21日にかけて開催された[Web Speed Hackathon 2026](https://cyberagent.connpass.com/event/371488/)に参加しました。

結果は **764.80 / 1150点** で、[issueに記録された時点](https://github.com/CyberAgentHack/web-speed-hackathon-2026-scoring/issues/8#issuecomment-4102937253)では暫定32位（132人中）になりました。最終計測で自己最高スコアを出せました。

ただし、レギュレーション違反（VRT不一致）によりランキングから除外されてしまいました。レギュレーション違反していなければ5位になれていた可能性があったんですけどね。トホホ〜。

## どこでレギュレーション違反になったか

違反の原因は、ユーザープロフィールのヘッダー背景色が初期状態と異なっていたことです。

`UserProfileHeader.tsx` でプロフィール画像の平均色をTailwindの動的クラス `bg-[${averageColor}]` として適用していましたが、`@tailwindcss/browser`（ランタイム）を `@tailwindcss/postcss`（ビルド時コンパイル）に置き換えたタイミングで、動的に組み立てたクラスが検出できなくなっていたことに気づけませんでした。

ビルド時コンパイルに置き換えるなら `style={{ backgroundColor: averageColor }}` のようにインラインスタイルに切り替える必要がありました（`averageColor` 自体は `useState()` で管理されています）。

とはいえレギュレーションに即しているかどうかを判定してもらえる点数を超えることはできたので、そこに至るまでの道のりを書きます。

## スコアを伸ばした段階

今回スコアを伸ばした段階は大きく3つあります。

### 1日目 18:08時点「219 → 498.75点」

初期ロードに関わる改善をまとめてデプロイした結果です。積み上げた改善によってユーザーフローをテストする閾値（300点）を超えました。

### 1日目 18:57時点「498.75 → 576.6点」

FFmpeg/ImageMagick WASMのdynamic importを実施し、数十MB単位でバンドルファイルを初期読み込みから除外したのと、ReDoSの修正を入れました。

### 1日目 22:26時点「576.6 → 750.85点」

GIF→MP4変換（TBT 6.7s→2.5s）、波形データの事前計算によるAudioContextデコード排除（TBT 2.5s→49ms）、JPEG→AVIF変換+リサイズ（画像容量93%削減、LCP 42s→7.3s）が中心です。

とりあえずこの3つをやった上で、より改善を積み重ねつつ、テストも継続的に実行して、レギュレーション違反しないかが重要です。それは毎年変わらないですね。

## リポジトリのクローン

まずリポジトリをクローンしてきたときに、リポジトリのサイズがおかしそうなことに気づきました。412個のオブジェクトに対して407.12 MiBは大きく感じます。

```shell
remote: Enumerating objects: 412, done.
remote: Total 412 (delta 0), reused 0 (delta 0), pack-reused 412 (from 1)
Receiving objects: 100% (412/412), 407.12 MiB | 9.07 MiB/s, done.
Resolving deltas: 100% (39/39), done.
Updating files: 100% (354/354), done.
```

これは後述しますが、シードデータのメディアファイルが合計334MBあり、これがリポジトリサイズの大半を占めていました。内訳は以下の通りで、GIFとJPEG形式のファイルが入っていて、まずここが最適化できそうということが分かります。

- 動画（GIF）179MB
- 画像（JPEG）89MB
- 音声（MP3）66MB

## 初期状態のアプリケーションをデプロイする

スコア計測はアプリケーションをデプロイしないことには始まりません。

しかし、運営が用意したfly.ioの環境は競技開始直後に認証周りで問題があって、ちょっとの間デプロイすることができなかったのと、自前の環境のほうが問題は少なくなりそうだったので、早々にfly.ioアカウントを作ってそこにデプロイすることを決めました。

`fly apps create {アプリ名}` でアプリを作成し、`fly deploy --app {アプリ名}` でデプロイしました。特に詰まることなくデプロイできたので良かったです。

## Lighthouse CIによる継続的パフォーマンス観測をする

最適化の効果を定量的に追跡するため、[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)を導入しました。

ローカルで実行するために `@lhci/cli` をdevDependencyに追加し、`pnpm lighthouse` でローカルサーバーに対してLighthouse CIを実行できるようにしました。

```bash
# application/ でサーバー起動後
pnpm lighthouse
```

改善施策の実装前後でこれを実行して、ターゲットのメトリクスが実際に改善したか確認していました。

また、特定のページだけ計測したい場合に備えて `lighthouse:page` スクリプトを用意し、`--collect.url` でURLを渡して個別に計測できるようにしました。

```bash
# ホームページだけ計測（1回実行）
pnpm lighthouse:page -- --collect.url="http://localhost:3000/"

# 検索ページだけ計測
pnpm lighthouse:page -- --collect.url="http://localhost:3000/search"
```

ただ今回に関しては[公式のscoring-tool](https://github.com/CyberAgentHack/web-speed-hackathon-2026/tree/main/scoring-tool)が提供されていたため、これを実行すれば良かったです。ここはなぜか見落とした私のミスです。

### パフォーマンス改善サイクルを自動で回す

パフォーマンス改善の進め方として「仮説→計測→変更→計測」のサイクルを[Claude Codeのルール](https://github.com/kubosho/web-speed-hackathon-2026/blob/main/.claude/rules/perf-optimization.md)にして、このサイクルが自動で回せるようにしていました。

ルール化したことによって、Claude Code上で「この部分が遅くなってそう」とプロンプトを投げて、それに基づきClaude Codeが「何が遅いか、なぜ遅いか、どのメトリクスに反映されるか」といった仮説を立て、Lighthouse CIによる計測で裏付けてから変更を入れた後にもう一度計測をして、ターゲットのメトリクスが改善しなければrevertするフローが割と自動化できました。

---

ここまでやったところで、パフォーマンス改善をやっていきます。

## バンドルサイズ分析

webpack-bundle-analyzerでバンドル構成を可視化して `main.js` が108MBという異常なサイズであることが分かりました。

サイズの大きい順に以下の通りです。

1. FFmpeg WASM (`ffmpeg-core.wasm?binary`)：動画処理用
2. ImageMagick WASM (`magick.wasm?binary`)：画像処理用
3. @mlc-ai/web-llm：AI推論エンジン
4. negaposi-analyzer-ja (`pn_ja.dic.json`）： 感情分析辞書
5. highlight.js / refractor：シンタックスハイライト（全言語入り）
6. kuromoji / katex：重量級ライブラリ群
7. moment / lodash / jquery / core-js / bluebird：現代基準でいらないライブラリ

## Webpack→Rspackへ移行し、複数の問題をいっぺんに解消する

Webpackの設定も問題が多かったです。一部を紹介すると以下の通りです。

- `mode: "none"`：minification無効
- `optimization.minimize: false`：圧縮無効
- `optimization.splitChunks: false`：コード分割無効

問題は他にもありますが、こういった問題を1つずつ直すより、Rspackに移行して設定をいい感じにするのが手っ取り早いと判断し、Rspackに移行したのち設定をいい感じにしました。

Rspack移行後に変えた設定は以下の通りです。

- `builtin:swc-loader` の使用
- `mode: "production"` への移行
- `splitChunks: { chunks: "all" }` でコード分割
- `devtool: false` でソースマップをバンドルから除外
- エントリーポイントから `core-js`, `regenerator-runtime` を除去
- CSSは `CssExtractRspackPlugin` + `css-loader` + `postcss-loader`
- `HtmlRspackPlugin` で `inject: true` にしてJS/CSSを自動的に注入

これによる結果は以下の通りになりました。

- ビルド時間：15秒以上 → 0.9秒
- エントリーポイント合計：108MB → 12.3MB
  - FFmpegやImageMagickは別バンドルとして出力されるようになった

## 初回スコア計測

ここまでやった段階でスコア計測をして、以下の結果になりました。

| テスト項目                   | CLS (25) | FCP (10) | LCP (25) | SI (10) | TBT (30) | 合計 (100) |
| ---------------------------- | -------- | -------- | -------- | ------- | -------- | ---------- |
| ホームを開く                 | 20.75    | 0.00     | 0.00     | 0.00    | 0.00     | 20.75      |
| 投稿詳細ページを開く         | 25.00    | 0.00     | 0.00     | 0.00    | 0.00     | 25.00      |
| 写真つき投稿詳細ページを開く | 24.75    | 0.00     | 0.00     | 0.00    | 0.00     | 24.75      |
| 動画つき投稿詳細ページを開く | 23.50    | 0.00     | 0.00     | 0.00    | 0.00     | 23.50      |
| 音声つき投稿詳細ページを開く | 25.00    | 0.00     | 0.00     | 0.00    | 0.00     | 25.00      |
| 検索ページを開く             | 25.00    | 0.00     | 0.00     | 0.00    | 0.00     | 25.00      |
| DM一覧ページを開く           | 25.00    | 0.00     | 0.00     | 0.00    | 0.00     | 25.00      |
| DM詳細ページを開く           | 25.00    | 0.00     | 0.00     | 0.00    | 0.00     | 25.00      |
| 利用規約ページを開く         | 25.00    | 0.00     | 0.00     | 0.00    | 0.00     | 25.00      |

合わせて219点でした。ユーザーフローテストは通常テストのスコアが300点未満だと計測されない仕様で、まずは300点を超えるのが最初の目標という感じです。

## Phase 1: 219→498点

### サーバーのgzip圧縮

サーバー側でレスポンスの圧縮が一切入っていなかったので、Expressに `compression` ミドルウェアを追加してgzipによる圧縮を有効化しました。

```diff
+import compression from "compression";
 import Express from "express";

 export const app = Express();

 app.set("trust proxy", true);

+app.use(compression());
 app.use(sessionMiddleware);
```

ついでにレスポンスヘッダーを確認したところ、全レスポンスに付与されていたヘッダーにも罠がありました。

```diff
-app.use((_req, res, next) => {
-  res.header({
-    "Cache-Control": "max-age=0, no-transform",
-    Connection: "close",
-  });
-  return next();
-});
```

- `no-transform`: プロキシやCDNによる変換の無効化
- `max-age=0`: ブラウザーキャッシュの無効化
- `Connection: close`: HTTP Keep-Aliveの無効化

3つとも意図的な妨害コードで、レスポンスデータの容量を増やしたりリクエストを無駄に飛ばしたりする効果があるので丸ごと消しました。

### 静的ファイルのcontenthashと長期キャッシュ

アセット類をキャッシュしようとして、Rspackの出力ファイル名にハッシュが付いていないことに気づきました。内容が変わったときにキャッシュが無効化されるよう `[contenthash]` を追加して長期キャッシュを使えるようにしました。

```js
// rspack.config.js
output: {
  filename: "scripts/[name]-[contenthash].js",
  chunkFilename: "scripts/chunk-[contenthash].js",
},
// CssExtractRspackPlugin
{ filename: "styles/[name]-[contenthash].css" }
```

そしてルーター側で `/scripts`, `/styles`, `/assets` に対し `Cache-Control: public, max-age=31536000, immutable` を設定しました。

```ts
// routes/static.ts
staticRouter.use('/scripts', (_req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
});
```

認証が必要なAPIレスポンスと、ハッシュを付けなかった静的ファイル（index.htmlなど）にはキャッシュヘッダーを付けていません。

### InfiniteScrollの不要な繰り返し判定の除去

`InfiniteScroll` コンポーネントで、スクロール位置が最下部に到達したかの判定を2 \*\* 18回繰り返していました。

「念の為」というコメントが付いていましたが、`window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight` は同一イベントハンドラ内では毎回同じ値を返す純粋な比較式で繰り返す意味がありません。

この判定は `scroll`, `wheel`, `touchmove`, `resize` の4イベントすべてで発火するため、スクロールするたびに約26万回のDOM参照と配列生成が走り、TBTを悪化させていました。

```diff
- // 念の為 2の18乗 回、最下部かどうかを確認する
- const hasReached = Array.from(Array(2 ** 18), () => {
-   return window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight;
- }).every(Boolean);
+ const hasReached = window.innerHeight + Math.ceil(window.scrollY) >= document.body.offsetHeight;
```

この実装は以前のWeb Speed Hackathonでもあったので、早めに「念の」でgrepしていました。こんなキーワードでgrepするのはWeb Speed Hackathonくらいな気がします。

### Reactマウントのloadイベント待ち除去

`index.tsx` を見ると、`window.addEventListener("load", ...)` の中でReactをマウントしていました。

`load`イベントは全リソースの読み込み完了後に発火するため、バンドルファイルのダウンロード＋パースが終わるまで描画が一切始まりません。

```diff
-window.addEventListener("load", () => {
-  createRoot(document.getElementById("app")!).render(
-    <Provider store={store}>
-      <BrowserRouter>
-        <AppContainer />
-      </BrowserRouter>
-    </Provider>,
-  );
-});
+createRoot(document.getElementById("app")!).render(
+  <Provider store={store}>
+    <BrowserRouter>
+      <AppContainer />
+    </BrowserRouter>
+  </Provider>,
+);
```

### Tailwind CSSのビルド時コンパイル

`index.html` で `@tailwindcss/browser@4.2.1` をCDNから同期スクリプトとして読み込み、ブラウザー内でCSSをコンパイルしている構成でした。

外部スクリプトのダウンロード＋パース＋CSSコンパイルで描画をブロックするので、`@tailwindcss/postcss` を導入して、ビルド時にCSSを生成するように変更しました。

そしてここまで変更をおこなったところで、ようやくパフォーマンス計測を行いました。結果は以下の通りです。

ビルド時コンパイル化後の計測結果（ホーム画面）:

| 指標                      | Before | After |
| ------------------------- | ------ | ----- |
| Performance               | 0.17   | 0.15  |
| FCP                       | 0.36   | 0.47  |
| LCP                       | 0      | 0     |
| CLS                       | 0.53   | 0.40  |
| render-blocking-resources | 2件    | 1件   |
| unused-javascript         | 2件    | 1件   |

FCPが0.36→0.47に改善しました。Performanceスコア自体は0.15に下がっていますが、個別のメトリクスが改善（FCP +0.11、CLS +0.13）していたので、改善を適用した状態にしました。

結果的にこの変更がレギュレーション違反の原因になるわけですが、当時の自分は気づいていませんでした。

### ルートベースのコード分割

全ルートのコンテナコンポーネントが `AppContainer.tsx` に静的importされており、巨大な単一バンドル（なんと12MB！）になっていました。

ホーム画面の表示に不要な `/crok`（web-llm, katex, react-syntax-highlighter）やNewPostModal（含むFFmpegとImageMagick）まで全て初期ロードに含まれている状態だったので、`React.lazy` + `Suspense` で全ルートコンテナとモーダルを遅延読み込みに変更しました。

```tsx
const TimelineContainer = lazy(() => import('@web-speed-hackathon-2026/client/src/containers/TimelineContainer'));
// ... 他のルートも同様

<Suspense>
  <Routes>
    <Route element={<TimelineContainer />} path="/" />
    {/* ... */}
  </Routes>
</Suspense>;
```

コード分割後の計測結果（ホーム画面）:

| 指標                      | Before | After              |
| ------------------------- | ------ | ------------------ |
| Performance               | 0.15   | 0.23               |
| FCP                       | 0.47   | ≥0.9 (warning消失) |
| render-blocking-resources | 1件    | 0件 (warning消失)  |

main.jsが12.3MiB→462KiB（96%削減）となり、FCPが大幅改善してwarningの閾値以下になりました。

### CoveredImageをネイティブ`<img>`に置換

`CoveredImage` コンポーネントを調べると、画像表示のために毎回 `jQuery.ajax` でバイナリをフェッチし、`image-size`でサイズ計算、`piexifjs`でEXIF抽出、Blob URL生成という重い処理を踏んでいました。これらは `<img>` + `object-fit: cover` に置き換えれば全部不要になります。

EXIFからのalt取得は「ALTを表示する」ボタン押下時のみ動的にインポートして実行するように変更し、`loading` 属性をpropsに追加した上で、ファーストビューに入る画像のみ `eager`、それ以外は `lazy` に設定しました。

```tsx
<img alt="" className="h-full w-full object-cover" loading={loading} src={src} />
```

置換後の計測結果（ホーム画面）:

| 指標                   | Before | After |
| ---------------------- | ------ | ----- |
| Performance            | 0.23   | 0.23  |
| offscreen-images       | 28件   | 1件   |
| uses-responsive-images | 47件   | 34件  |
| lcp-lazy-loaded        | -      | 解消  |

Performanceスコアは変わっていませんが、offscreen-imagesが28→1件に減りました。画像がJS経由ではなくブラウザーネイティブで読み込まれるようになった効果です。

### jQuery → native fetchへの置換

`fetchers.ts` を見ると、全HTTPリクエストを `$.ajax({ async: false })` で実行していました。`async: false` は同期XHRなのでリクエスト中メインスレッドがブロックされます。これをネイティブの `fetch` APIに置き換えました。

置き換え後に気づいたこととして、`fetchers.ts` 内のFetch APIラッパーである `sendJSON` がリクエストボディをgzip圧縮した上で `Content-Encoding: gzip` ヘッダーを付けてリクエストしようとしたときに、Fetch APIを使うとDM送信と投稿が失敗していました。

[Constructing a Response with Content-Encoding? · Issue #589 · whatwg/fetch](https://github.com/whatwg/fetch/issues/589)で書かれていますが、ブラウザー（Chrome）側でレスポンスデータは自動解凍してくれるにも関わらず、リクエスト時には自動圧縮してくれないという一貫性のなさがあるようです。

とはいえRequest時に `Content-Encoding` を付けることは比較的まれという記述もissueにあって、実際に私もRspack設定内の `ProvidePlugin` から `$` と `window.jQuery` を削除することで問題がなくなりました。

Fetch API置換後の計測結果（ホーム画面）:

| 指標                 | Before  | After   |
| -------------------- | ------- | ------- |
| エントリーポイント   | 462 KiB | 377 KiB |
| deprecations failure | あり    | 解消    |
| charset failure      | あり    | 解消    |

エントリポイントが85KiB縮小し、jQuery由来の非推奨API warningも解消されました。

### web-llmのdynamic import化

`TranslatableText` コンポーネントが `createTranslator` をstatic importしていた影響で、依存していた `@mlc-ai/web-llm`がタイムラインのチャンクに存在していました。翻訳機能はユーザーが「Show Translation」ボタンを押した時のみ使われるため、クリック時にdynamic importするよう変更しました。

dynamic import後の計測結果（ホーム画面）：

| 指標        | Before | After |
| ----------- | ------ | ----- |
| Performance | 0.20   | 0.24  |

web-llmがタイムラインのチャンクから分離され、ホーム画面の初期ロードに含まれなくなったことでパフォーマンスの値が上がりました。

### momentの除去

複数のコンポーネントで日付フォーマットに `moment`が使われていましたが、使い方を調べたところ3パターンしかありませんでした。

- `moment(date).locale("ja").format("LL")` →「2026年3月20日」
- `moment(date).locale("ja").fromNow()` →「3時間前」
- `moment(date).locale("ja").format("HH:mm")` →「17:30」

なので `Intl.DateTimeFormat` と `Intl.RelativeTimeFormat` で置き換えて、momentの依存をなくしました。

ただ相対的に他と比較してパッケージサイズが小さいため、パフォーマンス改善にはつながりませんでした。

## Phase 2: 498→576点

### ReDoS脆弱性の修正

クライアント側の正規表現を調べたところ、3箇所にReDoS（Regular Expression Denial of Service）パターンが仕込まれていました。いずれもネスト量指定子によって指数関数的にバックトラッキングが増えていました。

1. `auth/validation.ts`：`/^(?:[^\P{Letter}&&\P{Number}]*){16,}$/v` → `/^[\p{Letter}\p{Number}]*$/v`（パスワードの記号チェック）
2. `search/services.ts`：`/since:((\d|\d\d|\d\d\d\d-\d\d-\d\d)+)+$/` → `/since:(\d{4}-\d{2}-\d{2})$/`（日付抽出）
3. `search/services.ts`：`/^(\d+)+-(\d+)+-(\d+)+$/` → `/^\d+-\d+-\d+$/`（日付形式判定。変数名が `slowDateLike` だった）

ReDoSはユーザー入力時（フォームバリデーション）で発火するため、ユーザーフローテストのINP/TBTで効果が出ました。

## Phase 3: 576→750点

### 動画のGIF→MP4変換

メディアファイルの最適化に着手しました。最初にリポジトリを取得したときにデータ容量が大きいことには気づいていたので、ここを改善することで各種指標が上がりそうという肌感がありました。

まずは動画です。動画は全てGIF形式で保存されていて、15ファイルで合計179MBとなっていました。

GIFは `PausableMovie` コンポーネントでfetchした後 `gifler` + `omggif` でフレーム単位にデコードしてcanvasへ描画する実装になっていて、メインスレッドでのデコード処理がTBTを悪化させていました。

そのため、まずはシードGIFをFFmpeg CLIでMP4 (H.264) に事前変換するスクリプトを作成して、動画をMP4形式にしました。

```bash
# `-movflags +faststart` オプションを追加して、moov atomをファイル先頭に配置し、ダウンロード完了前からストリーミング再生できるようにした
ffmpeg -i "$gif" \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  -loglevel warning \
  "$mp4"
```

また `PausableMovie` コンポーネントをネイティブのvideo要素に置き換えて `gifler`, `omggif` の依存を削除しました。

```tsx
<video ref={videoRef} autoPlay className="w-full" loop muted playsInline src={src} />
```

その他にソースコード内で点在した拡張子を変えることで、GIFからMP4へ置き換えられました。

GIF→MP4変換後の計測結果（ホーム画面）：

| 指標        | Before | After |
| ----------- | ------ | ----- |
| Performance | 0.22   | 0.25  |
| LCP         | 147s   | 43s   |
| TBT         | 6.7s   | 2.5s  |
| SI          | 3.4s   | 0.55s |

TBTが6.7s→2.5sに大幅改善しました。gifler/omggifによるフレーム単位のデコードがなくなり、指標改善に寄与しました。LCPも147s→43sに短縮しましたが、とはいえまだまだパフォーマンス改善の余地がありすぎる状態です。

また動画のファイルサイズも元のGIFが合わせて179MBあったところ、73MBまで減りました。

### 音声の波形事前計算とビットレート削減

次に音声の最適化です。`SoundPlayer` コンポーネントがMP3ファイル全体を取得した後に、`SoundWaveSVG` がArrayBufferをAudioContextを使ってデコードし波形データを作成するための計算をしていました。この一連の処理がメインスレッドをブロックしていて、TBTの悪化原因になっていました。

これを解消するため、FFmpegでMP3をPCM（signed 16-bit LE, stereo）へデコードした上で、左右チャンネルの平均を取って100チャンクへ分割し、各チャンクの平均値を事前にJSONへ保存するようにしました。

`SoundWaveSVG` はAudioContextの `decodeAudioData` と `lodash` による波形計算を丸ごと消して、事前計算済みの波形JSONを `fetchJSON` で取得する形に変更しました。

`SoundPlayer` もArrayBufferへの読み込みとBlobURL生成（`useFetch` + `fetchBinary`）をやめて `<audio src>` に音声ファイルのパスを直接渡す形にして、`lodash` と `standardized-audio-context` の依存を無くしました。

MP3のビットレートもSNS用途としては高かったため、128kbpsに再エンコードし直すことで総容量を66MBから38MBに削減しました。

波形事前計算後の計測結果（ホーム画面）：

| 指標              | Before | After |
| ----------------- | ------ | ----- |
| Performance       | 0.25   | 0.56  |
| TBT               | 2.5s   | 49ms  |
| SI                | 550ms  | 501ms |
| LCP               | 43s    | 42s   |
| total-byte-weight | 106MB  | 79MB  |

TBTが2.5s→49msに改善しました。

AudioContextによるデコードを排除したことで、メインスレッドのブロックがほぼなくなっています。Performanceスコアも0.25→0.56に上がり、いくつかやった改善の中でも特に大きな変化となりました。

音声投稿の個別ページでもTBTが448ms→0msになりました。

### 画像のAVIF変換とリサイズ

最後に画像です。画像は全てJPEGで配信されているかつ、ページ内で使われるサイズに対して解像度が高すぎたことから、なんらかの最適化をする必要があることは自明でした。

ここではAVIFを選択しました。WebPより圧縮効率が高い点と2024年1月時点でBaselineのNewly availableに達している点が判断材料です。

sharpを使って、投稿画像をメインコンテンツの最大幅である1280px、プロフィール画像を256pxへリサイズしつつ、AVIF (quality 75) へ変換するスクリプトを作り、ソースコード内の拡張子を `.jpg` → `.avif` へ変更して、元のJPEGファイルを削除しました。

```js
// 投稿画像は最大幅1280px、プロフィール画像は256px（128px × 2 for Retina）
await sharp(inputPath).resize({ width: maxWidth, withoutEnlargement: true }).avif({ quality: 75 }).toFile(outputPath);
```

AVIF変換後の計測結果（ホーム画面）：

| 指標              | Before | After |
| ----------------- | ------ | ----- |
| Performance       | 0.56   | 0.56  |
| LCP               | 42s    | 7.3s  |
| total-byte-weight | 79MB   | 35MB  |
| TBT               | 49ms   | 0ms   |

AVIF変換後の計測結果（画像投稿ページ）：

| 指標        | Before | After |
| ----------- | ------ | ----- |
| Performance | 0.73   | 0.96  |
| LCP         | 12.7s  | 1.0s  |

投稿画像は86MB→6.1MBで93%の削減、プロフィール画像は3.2MB→416KBで87%の削減となりました。また、画像投稿ページのLCPが12.7s→1.0sになり、Performanceスコアが0.96に到達しました。

### メディアのキャッシュヘッダーとcompression除外

メディアファイル（`/images`, `/movies`, `/sounds`）に `Cache-Control` ヘッダーが付いておらず、`serve-static` のデフォルト `max-age=0` が適用されていました。さらにAVIF/MP4/MP3のような圧縮済みバイナリにも `compression` がgzipをかけようとしていたので、キャッシュ設定の追加とcompression除外の両方を対応しました。

メディアパスに `Cache-Control: public, max-age=86400` を設定し、`compression` ミドルウェアのfilterでメディアパスを除外しました。`serve-static` のデフォルト `max-age=0` がミドルウェアで設定したヘッダーを上書きしていたので、`cacheControl: false` も必要でした。

```ts
// static.ts
for (const path of ['/images', '/movies', '/sounds']) {
  staticRouter.use(path, (_req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    next();
  });
}
```

キャッシュヘッダー設定後の計測結果（ホーム画面）：

| 指標        | Before | After |
| ----------- | ------ | ----- |
| Performance | 0.56   | 0.56  |
| LCP         | 7.3s   | 7.3s  |
| TBT         | 0ms    | 0ms   |

Lighthouseの単発計測ではスコアが変わりません。キャッシュは2回目以降のナビゲーションで効果が出るため、初回アクセスのみを計測するLighthouseでは差が出にくいです。

### 画像ALTテキストのEXIF往復を廃止

手動テスト項目に「画像のEXIFに埋め込まれたImage DescriptionがALTとして表示されること」という要件がありました。調査の結果、既存の実装は以下の流れでした。

1. クライアント：WASM版ImageMagickで画像を変換し、`img.comment` からEXIFのImageDescriptionを取得
2. クライアント：piexifjsでJPEGのEXIFにImageDescriptionを書き戻し
3. サーバー：JPEGバイナリをファイルとして保存
4. 表示時：`CoveredImage` が画像バイナリ全体を再取得し、piexifjsでEXIFを読み取り

alt用のテキストをバイナリメタデータとして往復させている流れです。`convertImage` の中で `img.comment` からalt用テキストは取得済みですが、EXIFに書き込んで、アップロードして、また取り出すということをしていました。

なので、altをデータベースに保存した上で文字列として取得する方式に変更しました。

1. 元のJPEGからpiexifjsで全ImageDescriptionを抽出し、`images.jsonl` に書き込んで `seed:insert` でSQLiteに反映
2. `convertImage` の戻り値を `Blob` → `{ blob, alt }` に変更。`img.comment` からaltを取得し、piexifjsによるEXIF書き込みを削除
3. `NewPostModalPage` で変換結果のaltを保持し、`NewPostModalContainer` の `sendNewPost` で `images: [{ id, alt }]` として `POST /api/v1/posts` に送信
4. サーバー側は `Post.create` の `include: images` でImageレコードを作成して、altをDBに保存
5. `CoveredImage` はpropsで `alt` を受け取り、APIレスポンスの値を直接表示。バイナリfetchとEXIFパースを削除

## Phase 4: 750点以降

### AspectRatioBox を CSS aspect-ratio に置き換え

`AspectRatioBox` コンポーネントは、JSで `clientWidth` を読み取り `setTimeout(500ms)` 後に高さを計算して `setState` する実装でした。これにより初回レンダリングから500ミリ秒の間、コンテンツが非表示になるとともに、高さが0から計算値に変わるタイミングでLayout Shiftが発生していました。

これをCSSの `aspect-ratio` プロパティに置き換えることで、CLSを解消するとともに無駄な遅延をなくしました。

```tsx
// Before: JS で高さを計算、500ms 遅延、resize リスナー付き
<AspectRatioBox aspectHeight={9} aspectWidth={16}>
  <div>...</div>
</AspectRatioBox>

// After: CSS aspect-ratio で即座にサイズ確定
<div className="w-full" style={{ aspectRatio: "16 / 9" }}>
  <div>...</div>
</div>
```

`aspect-ratio` 置き換え後の計測結果：

| ページ                          | CLS before | CLS after | Score before | Score after |
| ------------------------------- | ---------- | --------- | ------------ | ----------- |
| `/`                             | 0.433      | 0.029     | 0.56         | 0.75        |
| `/posts/fe6712a1...` (画像投稿) | 0.098      | 0.004     | 0.94         | 0.96        |
| `/posts/fff790f5...` (動画投稿) | 0.199      | 0.099     | 0.66         | 0.73        |
| `/posts/fefe75bd...` (音声投稿) | 0.006      | 0.000     | 1.0          | 1.0         |

### フォントの最適化（OTF → サブセット woff2 + font-display: swap）

利用規約ページで使用されるカスタムフォント「Rei no Are Mincho」がOTF形式（各6.3MB）で配信され、`font-display: block` が指定されていました。フォント読み込み完了までテキストが非表示になるのでLCPに直接影響しています。

これは以下の修正をすることでフォントファイルのサイズを100KB前後にしました。

1. TermPageで実際に使われている471文字だけに絞ったサブセットフォントを生成（`pyftsubset`）
2. OTF → woff2に変換

またフォントの表示方法を `font-display: block` → `font-display: swap` に変更しています。

なお、最初はフォントをwoff2形式に変換しただけで、サブセット化まではやっていなかったですが、これによりLCPが645ms → 3,645msに悪化していました。

原因は `font-display: swap` によりフォールバックフォントで即座にテキストが描画され（FCP）、カスタムフォントがダウンロードされた後の再描画がLCPとして計測されたためで、これによりサブセット化も実施することを決めました。

利用規約ページの計測結果：

| 指標  | Before | After |
| ----- | ------ | ----- |
| FCP   | 204ms  | 206ms |
| LCP   | 645ms  | 730ms |
| SI    | 204ms  | 206ms |
| CLS   | 0.018  | 0.019 |
| Score | 100    | 100   |

### タイマー系サボタージュコードの除去

`setTimeout` / `setInterval` の使用箇所を調査したところ、パフォーマンスに悪影響を与えている箇所が3つ見つかりました。

#### DirectMessagePage の setInterval → ResizeObserver

DMページで `setInterval(..., 1)` を実行し、その中で `getComputedStyle` を1ms間隔で呼び続けている箇所がありました。強制リフローが連続発生するのでTBT/INPに悪影響があります。

```tsx
useEffect(() => {
  const id = setInterval(() => {
    const height = Number(window.getComputedStyle(document.body).height.replace('px', ''));
    if (height !== scrollHeightRef.current) {
      scrollHeightRef.current = height;
      window.scrollTo(0, height);
    }
  }, 1);
  return () => clearInterval(id);
}, []);
```

これを `ResizeObserver` に置き換えました。`ResizeObserver` はブラウザーのレイアウト処理完了後にコールバックが呼ばれるため `getComputedStyle` のような強制reflowを引き起こしません。

```tsx
useEffect(() => {
  const observer = new ResizeObserver(() => {
    const height = document.body.scrollHeight;
    if (height !== scrollHeightRef.current) {
      scrollHeightRef.current = height;
      window.scrollTo(0, height);
    }
  });
  observer.observe(document.body);
  return () => observer.disconnect();
}, []);
```

#### crok SSE の 3秒 sleep 削除

`/api/v1/crok` のSSEレスポンス開始前に `await sleep(3000)` がありました。AIチャットの応答開始を3秒遅延させる意図的なサボタージュコードだったので削除しました。

#### crok SSE の sleep 削除

さらに1文字ずつSSE送信する際にも `await sleep(10)` が入っていました。`sleep(10)` を削除し、`sleep` 関数自体も除去しました。

1文字ずつイベントとして送信する構造は維持しており、Node.jsのI/Oバッファリングによりクライアント側ではストリーミング表示として見えると判断しました。

### 不要ポリフィル・レガシーコードの除去

bluebird、lodash、buffer polyfillの3つがクライアントバンドルに残っていたので除去しました。

ポリフィル除去後の計測結果（ホーム画面）：

| 指標        | Before | After |
| ----------- | ------ | ----- |
| Performance | 0.75   | 0.76  |
| SI          | 497ms  | 325ms |

### ホーム画面におけるLCPの画像をpreloadで読み込む

ホーム画面のLCPが3.8秒で、内訳を見るとLoad Delay（ブラウザーが画像を発見するまでの遅延）が3.308sかかっていました。

SPAアーキテクチャでJS実行→API→Reactによる描画という直列のチェーンを経て初めて `<img>` タグがDOMに挿入されるのが原因でした。

なので、サーバー側でHTMLを返す際にDBから最初の画像付き投稿を取得し、`<link rel="preload" as="image">` を `<head>` へ注入するようにしました。

```typescript
// application/server/src/routes/static.ts
staticRouter.get('/', async (_req, res, next) => {
  const posts = await Post.findAll({ limit: 10, offset: 0 });
  const firstPostWithImage = posts.find((p) => p.images?.length > 0);
  const firstImageId = firstPostWithImage?.images?.[0]?.id;
  // index.htmlの<head>に <link rel="preload" as="image" href="/images/{id}.avif"> を注入
});
```

改善後の計測結果（ホーム画面）：

| 指標         | Before        | After         |
| ------------ | ------------- | ------------- |
| LCP          | 3.8s          | 3.4s          |
| Load Delay   | 3,308ms (87%) | 0ms (0%)      |
| Render Delay | 339ms (9%)    | 3,326ms (96%) |

Load Delayは解消し、LCPも改善はされましたが、Render Delayにボトルネックが移動するだけになって、あまり効果はなかったです。

### useInfiniteFetchのサーバー側pagination対応

`useInfiniteFetch` フックを調べると、API呼び出しのたびに全件取得してクライアント側で `slice` していました。

APIは `limit`/`offset` パラメータに対応しているのにクライアントが使っていなかったので、サーバー側paginationに変更しました。

```typescript
// Before: 毎回全件取得してクライアントでslice
void fetcher(apiPath).then((allData) => {
  data: [...cur.data, ...allData.slice(offset, offset + LIMIT)],
});

// After: サーバー側paginationで必要分だけ取得
const paginatedPath = `${apiPath}?limit=${LIMIT}&offset=${offset}`;
void fetcher(paginatedPath).then((pageData) => {
  data: [...cur.data, ...pageData],
});
```

改善後の計測結果（ホーム画面）：

| 指標              | Before  | After   |
| ----------------- | ------- | ------- |
| LCP               | 3.4s    | 3.4s    |
| Render Delay      | 3,326ms | 3,205ms |
| Performanceスコア | 81      | 82      |

思ったより効果は小さいですが、全ページで不要なデータ転送を削減する修正になるはずだったのでそのままにしました。

### Font Awesome SVG sprite の軽量化

Font AwesomeのSVGスプライトファイルにすべてのアイコンが入っていて無駄だったので削減しました。合計で約1.2MBから8.6KBになりましたが、この変更がパフォーマンス改善に直接は効きませんでした。

| ファイル    | Before               | After              | 備考                 |
| ----------- | -------------------- | ------------------ | -------------------- |
| solid.svg   | 639KB (1002アイコン) | 7.4KB (17アイコン) | 使用アイコンのみ抽出 |
| regular.svg | 107KB (458アイコン)  | 1.2KB (1アイコン)  | calendar-altのみ使用 |
| brands.svg  | 458KB (458アイコン)  | 削除               | コード中で未参照     |

## 最終計測

ここまで書いたことや、書いていない細かい修正もやった上で、競技終了8分前の18時22分に計測をしてスコアが **764.80点** となりました。詳細は以下の通りです。

| テスト項目                   | CLS (25) | FCP (10) | LCP (25) | SI (10) | TBT (30) | 合計 (100) |
| ---------------------------- | -------- | -------- | -------- | ------- | -------- | ---------- |
| ホームを開く                 | 25.00    | 8.00     | 8.75     | 3.20    | 0.00     | 44.95      |
| 投稿詳細ページを開く         | 25.00    | 8.80     | 17.00    | 8.40    | 29.40    | 88.60      |
| 写真つき投稿詳細ページを開く | 25.00    | 9.20     | 17.75    | 9.20    | 29.70    | 90.85      |
| 動画つき投稿詳細ページを開く | 25.00    | 9.20     | 17.75    | 8.70    | 23.10    | 83.75      |
| 音声つき投稿詳細ページを開く | 25.00    | 9.30     | 17.75    | 9.80    | 30.00    | 91.85      |
| 検索ページを開く             | 25.00    | 8.90     | 0.75     | 9.40    | 8.10     | 52.15      |
| DM一覧ページを開く           | 25.00    | 8.80     | 16.00    | 6.90    | 23.70    | 80.40      |
| DM詳細ページを開く           | 25.00    | 9.10     | 13.00    | 5.40    | 0.00     | 52.50      |
| 利用規約ページを開く         | 25.00    | 9.20     | 19.25    | 9.20    | 8.10     | 70.75      |

| ユーザーフローテスト                 | INP (25) | TBT (25) | 合計 (50)      |
| ------------------------------------ | -------- | -------- | -------------- |
| ユーザー登録→サインアウト→サインイン | 25.00    | 9.00     | 34.00          |
| DM送信                               | -        | -        | 計測できません |
| 検索→結果表示                        | 25.00    | 25.00    | 50.00          |
| Crok AIチャット                      | 25.00    | 0.00     | 25.00          |
| 投稿                                 | -        | -        | 計測できません |

計測できませんと出た部分に関しては運頼みとなりました。

## 振り返り

最初に書いた通り、レギュレーション違反によりランキングから除外されました。レギュレーション違反したことは純粋に悔しいです。

違反の原因を振り返ると、VRTの実行頻度がそこまで頻繁ではなかったこと、Tailwind CSSの置き換え時に元の挙動が維持されているか検証しなかったことに帰結します。

表示・動作を壊していないことを確認する仕組みもワークフローに組み込む必要がありました。たとえばClaude Codeのhookを使ってVRTを実行できていればよかったかなと感じています。

あとはテストケースを事前に読んでおき、修正前後で動作を担保する仕組みを作れれば良かったです。

### AIエージェントを使う前提になった結果

今までのWeb Speed Hackathonと比較して変更を多く入れることができて、コミット数は初めて100を超えました。これはAIエージェントによる高速な実装ができたためだと考えています。Lighthouseを逐次回していた影響で並列化はあまりできなかったですが、改善を並列でやっていればより多くの変更を入れられたはずです。

ただ、パフォーマンスチューニングをする・しないといった判断はまだ人間側に委ねられていると感じました。手当り次第に改善をしても指標の向上につながらないことはあります。どの指標が改善につながるか推測するのは、まだ人間の仕事だと感じます。

個人的にはどうしてもデータベース周りが弱くてインデックスを貼る思考に至らなかった反省があります。

一方で来年には景色が変わっていそうです。2025年3月時点ではCursorなどからAIを使うことが一般的だったところから、Claude CodeやCodexを中心としたCLI中心の世界になって、さまざまなツールとの連携もできるようになってきたという変化もありました。

2027年にもWeb Speed Hackathonは開催されるでしょうが、その頃には、AIエージェントがより安全に自律して動けるようになって、提案を積極的にしてくるようになり、人間はAIエージェントが自律的に動く間に次の手を打つということが当たり前になっていそうです。
