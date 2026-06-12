---
status: todo
---

# profile ページの about ページ化とサイト概要の追加

## 目的

既存の `/profile` ページを `/about` に移し、ページ冒頭にこのサイト（ブログ）の概要を加える。既存のプロフィール文章は書き換えずにそのまま残す。あわせて旧 URL `/profile` へのアクセスをリダイレクトで救済し、サイト内の参照リンクを張り替えることで、リンク切れと内容の重複を防ぐ。

## 受け入れ基準

### AC-1：about ページの新設とサイト概要・プロフィール文の表示

- 入力 → 結果：ビルド後に `/about` へアクセスすると、frontmatter の `title` が「このサイトについて」の単一ページが表示され、次の2つが両方とも本文に含まれる。
  - サイト概要の段落：「このサイトはkuboshoが運営する個人ブログです。Webフロントエンド開発を中心としたソフトウェアづくりの知見や、日々考えたことを記事として公開しています。」
  - 既存プロフィール文の全文（「インターネット上では `^kubo(?:sho_?|5ho)$` の名前で活動しています。」以降、現行 `app/src/pages/profile.md` の本文すべて）

### AC-2 (Depends On：AC-1)：旧 URL のリダイレクト

- 入力 → 結果：AC-1 が完了した状態で `app/public/_redirects` を確認すると、`/profile /about 308` の行が存在する。かつ `app/src/pages/profile.md` が存在せず、ビルド成果物に `/profile` のページが生成されない。

### AC-3 (Depends On：AC-1)：フッター内部リンクの張り替え

- 入力 → 結果：AC-1 が完了した状態でビルド後のフッターを確認すると、著者名リンク（`GlobalFooter.astro` の `itemprop="name"` のアンカー）の `href` が `/about` になっている。`app/constants/pathList.ts` のキーが `about`（値 `'about'`）で、`GlobalFooter.astro` がそれを参照する。

## ネガティブ要件

- 既存プロフィール文の文章を書き換え・要約・削除しない。そのまま温存する。
- `app/src/pages/profile.md` をリネーム後に残さない（`/profile` の静的ページが生成されると `_redirects` のリダイレクトが効かなくなるため）。
- ヘッダーナビゲーションなど、フッター以外の場所に `/about` への新規リンクを追加しない。
- リダイレクト用の新しい仕組み（astro.config の `redirects` 設定や middleware 等）を導入しない。既存の `app/public/_redirects` に追記する。
- リダイレクトのステータスコードを既存規約（308）から変えない。

## スコープ上限

想定変更量は 4 ファイル前後、総行数の目安は 30 行以内。これを大きく超えたら軸Cで超過候補として扱う。

## 技術的制約

- ページ実体は `app/src/pages/profile.md` を `app/src/pages/about.md` に移動して作る。レイアウトは現行どおり `../layouts/SinglePage.astro` を使う。
- about.md の本文は「サイト概要の段落 → 既存プロフィール文」の順で構成する。概要とプロフィールは見出し（`##`）で区切ってよいが、`title` は SinglePage が `h1` として描画するため本文先頭に `h1` を置かない。
- リダイレクトは `app/public/_redirects` に `/profile /about 308` を 1 行追記する。既存行（`/entry/:slug` 等）の 308 形式に合わせる。
- `app/constants/pathList.ts` の `profile: 'profile'` を `about: 'about'` に変更し、`GlobalFooter.astro:75` の `pathList.profile` 参照を `pathList.about` に変更する。

## タスク一覧

- [ ] AC-1：about ページの新設とサイト概要・プロフィール文の表示
- [ ] AC-2：旧 URL のリダイレクト
- [ ] AC-3：フッター内部リンクの張り替え

進行中のタスクは `- [ ] AC-N：（進行中）タスク名`、完了したタスクは `- [x] AC-N：タスク名` と書く。

## 検証ゲート

- 軸A：受け入れ基準に対応するテストまたは存在チェックが成功している
- 軸B：diff がネガティブ要件に反していない
- 軸C：diff 量がスコープ上限を大きく超えていない
- 軸D：軸Bまたは軸Cの候補がある場合だけ、人間が最終判定する
