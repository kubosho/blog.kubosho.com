---
title: eslint-plugin-importによってVitestの設定ファイル上でエラーが発生する場合がある
categories: [技術]
tags: [TypeScript, Vitest, ESLint]
publishedAt: 2022-11-23T05:16:24.348Z
revisedAt: 2022-11-23T05:50:53.625Z
---

`vitest` と `eslint-plugin-import` に依存している環境では、vitest.config.ts内で `vitest/config` をインポートすると `Unable to resolve path to module 'vitest/config'. eslint(import/no-unresolved)` というエラーが出る場合があります。

これはnode_modules/vitest以下にconfig.d.tsだけがある状態で、config.jsの実体はdist/config.jsにあることが元で発生するようです。ディレクトリ構造を示すと次のようになります。

```
/node_modules/vitest
|-- dist
|   |-- config.cjs
|   |-- config.d.ts
|   |-- config.js
`-- config.d.ts
```

vitest/config.d.tsの内容はvitest/dist/config.jsでexportしているものをそのままexportしています。

```typescript
export * from './dist/config.js';
```

## 解決方法

ESLintの設定ファイルで `import/resolver` 内の `node.extensions` の値に `d.ts` を追加すると `d.ts` 内のモジュール読み込みが解決できるようになり、ESLintの `import/no-unresolved` のエラーが無くなります。

```javascript
settings: {
  'import/resolver': {
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
    },
  },
}
```
