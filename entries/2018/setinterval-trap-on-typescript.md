---
title: TypeScriptのsetInterval()の返り値には罠がある
created_at: 2018-07-18
categories: 技術
tags: TypeScript
---

以下のようなコードを書いた場合、TypeScript から JavaScript へコンパイルする時、もしくはエディタ内で `Type 'Timer' is not assignable to type 'number'.` と怒られます。

```typescript
export class FooClass {
  intervalId: number;

  constructor() {
    this.intervalId = 0;
  }

  setCountDown() {
    this.intervalId = setInterval(() => {
      // do something
    }, 1000);
  }

  resetCountDown() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }
}
```

## 原因

エラーメッセージの通り `setInterval()` の返り値が `NodeJS.Timer` となっているためです。

## 解決方法

### 1. `setInterval()` を使う箇所で `window.setInterval()` とする

`window` オブジェクトにある `setInterval()` の返り値の型は `number` となっているため、`window.setInterval()` が使える環境であれば、これを使うと楽に解決できます。
参考: [setInterval - Type 'Timer' is not assignable to type 'number' · Issue #1053 · TypeStrong/atom-typescript](https://github.com/TypeStrong/atom-typescript/issues/1053#issuecomment-321126192)

### 2. コードを少し複雑にする

`setInterval()` を使うときに `window.setInterval()` と `window` オブジェクトにある `setInterval()` を明示的に使う方法は、たとえばサーバーサイドレンダリングをしているときには使えません。

この場合は以下のように `intervalId` の初期値に `null` を入れておいて `clearInterval()` を実行するところで `setInterval()` の返り値が `this.intervalId` に入っているか確かめるのが良いでしょう。

```typescript
export class FooClass {
  intervalId: NodeJS.Timer | null;

  constructor() {
    this.intervalId = null;
  }

  setCountDown() {
    this.intervalId = setInterval(() => {
      // do something
    }, 1000);
  }

  resetCountDown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = null;
  }
}
```

## まとめ

手癖のように `intervalID` が入るところで初期値として `0` を代入していましたが、TypeScript ではハマる可能性が高い（というか今日ハマった）ので、気をつけましょうという話でした。
