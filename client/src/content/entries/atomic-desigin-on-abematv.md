---
title: Atomic Designを実案件に導入して運用してみた結果はどうなのか
excerpt: かつてAtomic Design の考え方と利点・欠点という記事を書きました。
categories: [技術]
tags: [Atomic Design]
publishedAt: 2017-12-18T00:00:00.000Z
revisedAt: 2022-11-28T15:23:41.646Z
---

かつて[Atomic Design の考え方と利点・欠点](http://blog.kubosho.com/entry/using-atomic-design)という記事を書きました。\
この記事内で日本では[AbemaTV](https://abema.tv/)で使われていると書きました。そして今でも AbemaTV では Atomic Design の考えに基づいてコンポーネントが作られています。

AbemaTV での経験を通じて、Web アプリケーションのクライアントサイドの開発者という立場から Atomic Design はどうなのかについて書いていきます。

なお AbemaTV ではビューライブラリとして React を使っているので、React 前提の話になります。

## Atomic Design に基づくのは実際どうなのか

基本的には良いです。良い点について書いていたら[Atomic Design を実案件に導入 - UI コンポーネントの粒度を明確化した結果と副産物 | ygoto3.com](https://ygoto3.com/posts/atomic-design-on-actual-project/)や[Atomic Design powered by React @ AbemaTV](https://www.slideshare.net/ygoto3q/atomic-desigin-powered-by-react-abematv/31)に書いてある内容と似てきたので、良い点についてはこれらの資料を見てください。

ただし問題点もあります。いま思いつく限りでは大きく 2 つ問題があると考えています。

### 人によってコンポーネントの粒度が違う

Atomic Design において `atoms` はそれ単体で使うことはなく `molecules` や `organisms` 内に取り込まれた状態で使われます。

また `molecules` にあたるコンポーネントは単一責任の原則に基づくのが良いとされています。

しかしコンポーネントによっては `props` が多すぎるものもあります。特に `molecules` の一部コンポーネントは `props` が 22 個あります。\
実際に該当のコンポーネントは挙動を変更する理由がいくつかある状態です。

この場合は責務ごとにコンポーネントを分割すればよかったのかもしれません。\
もしくは[Higher-Order Components - React](https://reactjs.org/docs/higher-order-components.html)を取り入れても良いかもしれません。

#### デザイナーとデベロッパーのコンポーネントの粒度も違う

今だとデザイナーが Sketch の Symbol 上に構築したコンポーネントの粒度とデベロッパーが実装したコンポーネントの粒度が違うものもあります。

デザイナーとデベロッパーのどちらかの考えに粒度を合わせるのが良いでしょう。\
この場合、基本的にはデザイナーの考えに合わせたほうが良いと思います。\
[morishitter の CSS の書き方（2016 年夏） - morishitter blog](http://morishitter.hatenablog.com/entry/2016/07/29/204642)にもある「デザインの意図を正確に理解した上で書かれた CSS は破綻しない」です。

とはいえ、自分もあまり余裕がなかったため「なぜこのデザインなのか」をあまり聞けていません（Slack 上でどのデザインにするかやりとりしているときに「これが良いですねー」とか反応するくらい）。

[Pattern Lab のデモ](http://demo.patternlab.io/)に作りたいコンポーネントのカテゴリーがあったらお互いそれに沿うようにするのもいいでしょう。\
たとえば `blocks` だったら `molecules` で `sections` だったら `organisms` という感じです。

### コンポーネントのテストが面倒

コンポーネントのテストを書く場合は `enzyme` を使って `find()` などを用いて要素があるかを探し、表示されている文字が期待のものと合致しているかなどをテストすると思います。

この場合テストとは直接的に関係ないコードがテストコード内に存在することになります。\
テストを書くときに Virtual DOM 内をいちいち探索しないといけなくなるため、そこまでテストコードが書かれていないコンポーネントが増えることにもなります。\
また各コンポーネントがどのような `props` を持っているか調べないといけないため特に `organisms` にあたるコンポーネントのテストは面倒になるでしょう。

そのため Jest の[Snapshot Testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)のように、スナップショットとなるコードを書いてテストコード側でそれと合致するか確かめるようにする流れができつつあります。

---

この記事は[AbemaTV Advent Calendar 2017](https://adventar.org/calendars/2216)の 17 日目の記事でした。\
AbemaTV では[Atomic Design のよりよい運用を考えたいデベロッパーを募集中](https://recruit.abematv.co.jp/jobs/engineer/)です。
