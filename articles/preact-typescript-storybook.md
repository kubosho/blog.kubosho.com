---
title: PreactとTypeScriptを使った環境でStorybookを使う方法
excerpt: Preact と TypeScript を使った環境で Storybook を使おうとしたら以下のエラーが出ました。
categories: [技術]
tags: [TypeScript, Storybook, Preact]
publishedAt: 2021-01-14T00:00:00.000Z
revisedAt: 2022-11-28T14:57:55.078Z
---

PreactとTypeScriptを使った環境でStorybookを使おうとしたら以下のエラーが出ました。

![Storybook上で出たエラー。ReferenceError: h is not definedと出ている。](https://blog-assets.kubosho.com/storybook_error.png)

原因はStorybookを使うために必要なパッケージとBabelの設定が足りなかったことでした。

なので、[storybook/lib/cli#Manually specify project type](https://github.com/storybookjs/storybook/tree/master/lib/cli#manually-specify-project-type)を参考に、次のコマンドを実行します。

```shell
npx -p @storybook/cli sb init --type preact
```

そして `.babelrc.js` を次のような設定にします。

```javascript
const presets = ['@babel/preset-env', '@babel/preset-typescript'];
const plugins = [
  [
    '@babel/plugin-transform-react-jsx',
    {
      runtime: 'automatic',
      importSource: 'preact',
    },
  ],
];

module.exports = { presets, plugins };
```

これでYarnを使っている環境であれば `yarn storybook` をターミナル上で実行することで、Storybookが表示されるようになります。

## 参考にしたページ

- [Uncaught ReferenceError: h is not defined · Issue #541 · preactjs/preact-compat](https://github.com/preactjs/preact-compat/issues/541)
