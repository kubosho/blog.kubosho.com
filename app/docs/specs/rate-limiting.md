---
status: Done
---

# API Rate Limiting

## 目的

Cloudflare WorkersにホスティングしているAPIに対して、過剰なリクエストを送信するクライアントからシステムを保護するため、Rate Limitingを実装する。

## 現状

- 現在、APIエンドポイント（`/api/likes/[id]`）にはRate Limitを実装しておらず、無制限にリクエストを送信できる状態
  - 悪意のある利用や誤った実装によって、過剰なリクエストが発生する可能性がある
  - データベース（Hyperdrive経由）への負荷が制御できない状態
- いいねリクエストは誰でも送信できる
  - 認証・認可という概念はこのブログにはなく、今後もその概念を持ち込む気はない

## 機能概要

Cloudflare Workers Rate Limiting APIを利用して、記事のIDをキーにしたRate Limitingを実装する。

### 仕様

- しきい値：10秒間に100リクエスト
- 制限時のレスポンス：HTTP 429 (Too Many Requests)
- クールダウン期間：30秒間
- 制限解除：クールダウン期間経過後、自動的に解除

### 対象エンドポイント

- `POST /api/likes/[id]`

## 機能一覧

### 1. Rate Limit Bindingの設定

- `wrangler.jsonc` にRate Limit Bindingを追加
- 環境ごと（staging / production）に適切な設定を定義

### 2. Rate Limitチェックロジックの実装

- リクエストごとにクライアントのIPアドレスを取得
- Cloudflare Workers Rate Limiting APIを使用してリクエスト数をカウント
- しきい値（10秒間に100リクエスト）を超過した場合、429エラーを返す

### 3. エラーレスポンスの実装

- 429エラー時の適切なレスポンスボディを返す
- `Retry-After` ヘッダーを含める（30秒のクールダウン）
- エラー内容をJSON形式で返す

### 4. 型定義の追加

- `worker-configuration.d.ts` にRate Limit Bindingの型定義を追加
  - `npx wrangler types` を実行して型定義を更新する
- `Env` インターフェースに `LIKES_RATE_LIMITER` を追加

## 変更対象のファイル

### 設定ファイル

- `wrangler.jsonc`: Rate Limit Bindingの追加
- `worker-configuration.d.ts`: 型定義の追加

### APIエンドポイント

- `src/pages/api/likes/[id].ts`: Rate Limitチェックロジックの実装

### ユーティリティ

- `src/features/likes/utils/rateLimiter.test.ts` (新規): Rate Limit関連のヘルパー関数
  - IPアドレス取得ロジック
  - Rate Limitチェック関数
  - エラーレスポンス生成関数

### テスト

- `src/features/likes/utils/rateLimiter.test.ts` （新規）: ユーティリティ関数のテスト
- `src/pages/api/likes/[id].test.ts` (新規または既存): APIエンドポイントのテスト
  - APIエンドポイントを[mswjs/msw](https://github.com/mswjs/msw)でモック化し、リクエストに対して意図したレスポンスが返るかをテストする

## 関連リンク

- [Cloudflare Workers Rate Limiting API](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- [Retry-After Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
