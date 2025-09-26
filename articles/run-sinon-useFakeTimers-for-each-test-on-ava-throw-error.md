---
title: AVA上でsinon.useFakeTimers()を複数のテスト内で実行するとエラーが出る
categories: [技術]
tags: [AVA, Sinon.JS, テスト]
publishedAt: 2022-05-20T00:57:40.873Z
revisedAt: 2022-05-20T05:23:39.303Z
---

[Sinon.JS](https://sinonjs.org/)のバージョンをv14.0.0に上げた際、エラーが出てテスト実行が失敗するようになりました。

この記事では対処方法を書いていきます。

## 事象

たとえば次のようなテストがあったとします。

`sinon.useFakeTimers` は[ドキュメント](https://sinonjs.org/releases/latest/fake-timers/)にある通り、`setTimeout` や `clearTimeout`などを置き換える関数です。

```javascript
import test from 'ava';
import sinon from 'sinon';

test('test', (t) => {
  const fakeTimer = sinon.useFakeTimers();
  t.pass();
  fakeTimer.restore();
});

test('test2', (t) => {
  const fakeTimer = sinon.useFakeTimers();
  t.pass();
  fakeTimer.restore();
});
```

2回目の `sinon.useFakeTimers()` を実行するとき、先ほどのテストファイルで言うと `test2` を実行するときに次のようなメッセージが表示されます。

```text
TypeError {
  message: 'Can\'t install fake timers twice on the same global object.',
}
```

## 原因

書き換えられたグローバルオブジェクトを戻すために `sinon.useFakeTimers` と `fakeTimer.restore()` を対になる形で実行しないといけません。

うっかり `fakeTimer.restore()` を実行しないまま `sinon.useFakeTimers` を実行すると、元の日時に復元することが難しくなります。

```javascript
// サンプル
const sinon = require('sinon@12.0.0');

console.log('Original time: ' + new Date().getTime()); // "Original time: 1653007080412"
let fakeTimer = sinon.useFakeTimers(Date.parse('2014-06-05T12:07:07.662Z'));
fakeTimer = sinon.useFakeTimers(Date.parse('2018-04-11T14:08:00Z'));
fakeTimer.restore();
console.log('Restored time: ' + new Date().getTime()); // "Restored time: 1401970027662"
```

今回のサンプルコードの場合はまだ復元できますが、これがより回数を重ねて `sinon.useFakeTimers` を実行してしまうとより復元が難しくなります。

この問題が、[Impossible to restore fake timers in certain situations. · Issue #2449 · sinonjs/sinon](https://github.com/sinonjs/sinon/issues/2449)で報告されて、対応として `@sinonjs/fake-timers` 側で[Prohibit faking of faked timers by cjbarth · Pull Request #426 · sinonjs/fake-timers](https://github.com/sinonjs/fake-timers/pull/426)というPull Requestがマージされました。

Pull RequestのSolutionに「If an attempt is make to fake a timer that is already faked, an exception will be thrown.」と書いてある通り、timerがすでにfakeだった場合に再度 `sinon.useFakeTimers` を実行した場合に例外が投げられるという変更がされました。

この変更により、複数のテストで `sinon.useFakeTimers` と `fakeTimer.restore` を実行していた場合に、AVA上でテストが並列で実行されることもあって `fakeTimer.restore` が実行される前に `sinon.useFakeTimers` が実行される場合が出てきました。

その結果として「Can't install fake timers twice on the same global object.」というエラーが出力されるようになりました。

## 解決策

解決方法は2つあります。

まず1つは、テストコード側で並列実行をやめて直列実行にすることです。具体的には次の通り書くとテストが成功します。

```javascript
import test from 'ava';
import sinon from 'sinon';

test.serial('test', (t) => {
  const fakeTimer = sinon.useFakeTimers();
  t.pass();
  fakeTimer.restore();
});

test.serial('test2', (t) => {
  const fakeTimer = sinon.useFakeTimers();
  t.pass();
  fakeTimer.restore();
});
```

または `test.before` や `test.after` といったテストファイル内の最初と最後のテスト前後で実行されるフックを使って、fakeTimerを使うのも良いです。

```javascript
import test from 'ava';
import sinon from 'sinon';

let fakeTimer = null;

test.before(() => {
  fakeTimer = sinon.useFakeTimers();
});

test.after(() => {
  if (!fakeTimer) {
    return;
  }
  fakeTimer.restore();
});

test('test', (t) => {
  t.pass();
});

test('test2', (t) => {
  t.pass();
});
```

AVAのように並列実行がデフォルトのテストフレームワークだと同じ問題が起きそうですが、他のJestやVitestなどはどうしているのか気になります。
