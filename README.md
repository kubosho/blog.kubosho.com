# kubosho.com

https://kubosho.com (まだ存在しません) や https://*.kubosho.com 用のリポジトリです。

## URL

| Type | URL                      | Status                                                                                                                |
| ---- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Blog | https://blog.kubosho.com | [![CircleCI](https://circleci.com/gh/kubosho/kubosho.com.svg?style=svg)](https://circleci.com/gh/kubosho/kubosho.com) |

## Development

### 必要なもの

- Node.js
- Yarn

### ローカル上でプレビュー環境を見るための手順

1. `yarn install` を実行して、パッケージをダウンロードします
2. `yarn create_entries` を実行して記事のデータを集めた JSON の作成をします
3. `yarn build` を実行して Next.js のビルドをします
4. `yarn dev` を実行してプレビュー用のサーバーを起動します
