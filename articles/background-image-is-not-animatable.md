---
title: background-imageは仕様上アニメーションを適用できない
categories: [技術]
tags: [CSS]
publishedAt: 2015-01-15T00:00:00.000Z
revisedAt: 2022-12-01T05:47:05.247Z
---

CSSで `@keyframes` に `background-image` プロパティを指定してクロスフェード効果で背景画像の表示が切り替わるという動作を実装しようとしました。

実際にChromeでは期待通りの動作をしました。ただFirefoxとAndroid Browserではアニメーションどころか画像自体が表示されずなぜそうなるのか謎でした。

[クロスフェードされないコードを確認するためのJSFiddle](http://jsfiddle.net/csmt3fyn/3/)

## そもそもbackground-imageはアニメーション不可能

<blockquote class="twitter-tweet" lang="ja"><p><a href="https://twitter.com/o_ti">@o_ti</a> <a href="https://twitter.com/kubosho_">@kubosho_</a> background-image はアニメーション不可能なプロパティでだからではないですか？</p>&mdash; xl1blue (@xl1blue) <a href="https://twitter.com/xl1blue/status/555695483037822977">2015, 1月 15</a></blockquote>

！？

<blockquote class="twitter-tweet" lang="ja"><p><a href="https://twitter.com/kubosho_">@kubosho_</a> <a href="https://twitter.com/xl1blue">@xl1blue</a> ホントだ。Animatable: no だった。<a href="http://t.co/JopFQtOO5F">http://t.co/JopFQtOO5F</a></p>&mdash; 越智 (@o_ti) <a href="https://twitter.com/o_ti/status/555696632675594240">2015, 1月 15</a></blockquote>

なん……だと……？

background-imageは仕様上アニメーション不可能なプロパティですが、Chromeが仕様に準拠していませんでした。

なので仕様に沿う形で書き直しました。

## 各ブラウザーでクロスフェードされるように書き直したコード

### HTML

```html
<div class="test-01">
  <img src="https://picsum.photos/id/0/400/200" alt="" />
  <img src="https://picsum.photos/id/1/400/200" alt="" />
</div>
```

### CSS

```css
.test-01 {
  position: relative;
}

.test-01 img:first-child {
  position: absolute;
  animation: crossfade 5s linear 0s infinite alternate;
}

@keyframes crossfade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

[クロスフェードされるコードを確認するためのJSFiddle](http://jsfiddle.net/ts2qu35b/20/)
