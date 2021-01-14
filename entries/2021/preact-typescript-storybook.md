---
title: PreactとTypeScriptを使った環境でStorybookを使う方法
created_at: 2021-01-14
categories: 技術
tags: Preact, TypeScript, Storybook
---

Preact と TypeScript を使った環境で Storybook を使おうとしたら以下のエラーが出ました。

![Storybook上で出たエラー。ReferenceError: h is not definedと出ている。](https://res.cloudinary.com/kubosho/image/upload/c_scale,w_1000/v1609928711/storybook_error_tndiaw.png)

原因は Storybook を使うために必要なパッケージと Babel の設定が足りなかったことでした。

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

これで Yarn を使っている環境であれば `yarn storybook` をターミナル上で実行することで、Storybook が表示されるようになります。

## 参考にしたページ

- [Uncaught ReferenceError: h is not defined · Issue \#541 · preactjs/preact\-compat](https://github.com/preactjs/preact-compat/issues/541)
