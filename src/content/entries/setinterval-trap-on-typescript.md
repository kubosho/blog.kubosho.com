---
title: TypeScriptでsetInterval()の型が合わない理由と解決方法
categories: [技術]
tags: [TypeScript]
publishedAt: 2018-07-18T00:00:00.000Z
revisedAt: 2022-11-28T08:18:51.814Z
---

`@types/node` に依存した状態で以下のようなコードを書いたときに `Type 'Timer' is not assignable to type 'number'.` というエラーメッセージが出ます。

```typescript
export class ExampleClass {
  intervalId: number;

  constructor() {
    this.intervalId = 0;
  }

  start() {
    this.intervalId = setInterval(() => {
      // do something
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }
}
```

## 原因

`@types/node` に依存している場合 `setInterval()` の返り値が `NodeJS.Timer` となるためです。`@types/node` に依存していなければ `setInterval()` の返り値は `number` になります。

- `@types/node` の型定義: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/010a8de/types/node/timers.d.ts#L73-L76
- TypeScriptの `lib.dom.d.ts` の型定義: https://github.com/microsoft/TypeScript/blob/3431912/lib/lib.dom.d.ts#L16739

## 解決方法

### 1. `setInterval()` を使う箇所で `window.setInterval()` とする

`window` オブジェクトにある `setInterval()` の返り値の型は `number` となっています。なので `window.setInterval()` が使える環境であれば `window.setInterval()` と書き換えると解決できます。

参考: [setInterval - Type 'Timer' is not assignable to type 'number' · Issue #1053 · TypeStrong/atom-typescript](https://github.com/TypeStrong/atom-typescript/issues/1053#issuecomment-321126192)

### 2. `setInterval()` の返り値を入れるプロパティの型を変更する

`window.setInterval()` と書き換える方法は、SSRをしているときには使えません。たとえばNext.jsを使っている場合にはエラーが出ると思われます。

この場合は以下のように `intervalId` の初期値に `null` を入れておいて、`clearInterval()` を実行するところで `setInterval()` の返り値が `this.intervalId` に入っているか確かめる方法があります。

```typescript
export class ExampleClass {
  intervalId: NodeJS.Timer | null;

  constructor() {
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      // do something
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = null;
  }
}
```

### 3. `setInterval()` 全体を `Number()` で囲む

[关于typescript的定时器setInterval()坑\_ollin2012的博客-CSDN博客\_ts 定时器类型](https://blog.csdn.net/ollin2012/article/details/88963553)で紹介されている手法を多少改変して、`setInterval()` 全体を `Number()` で囲んで `number` 型にtype assertionする手法もあります。

```typescript
export class ExampleClass {
  intervalId: number;

  constructor() {
    this.intervalId = 0;
  }

  start() {
    this.intervalId = Number(
      setInterval(() => {
        // do something
      }, 1000),
    );
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }
}
```

## まとめ

手癖のように `intervalID` が入るところで初期値として `0` を代入していましたが、TypeScriptではハマる可能性が高いので気をつけましょう。
