---
title: background-image はアニメーション出来ない(問題と解決のコード付き)
created_at: 2015-01-15
categories: 技術
tags: CSS
---

## 何が起きたか

http://jsfiddle.net/bo5rj0b5/4/

上記の jsfiddle で CSS の所に書いたように、keyframes に background-image プロパティを指定して、クロスフェード効果で背景画像の表示が切り替わるという動作を期待しました。

Chrome では、期待通りの動作をしたのですが、Firefox と Android Browser ではアニメーションどころか、画像自体が表示されませんでした。

## 解決

<blockquote class="twitter-tweet" lang="ja"><p><a href="https://twitter.com/o_ti">@o_ti</a> <a href="https://twitter.com/kubosho_">@kubosho_</a> background-image はアニメーション不可能なプロパティでだからではないですか？</p>&mdash; xl1blue (@xl1blue) <a href="https://twitter.com/xl1blue/status/555695483037822977">2015, 1月 15</a></blockquote>

！？

<blockquote class="twitter-tweet" lang="ja"><p><a href="https://twitter.com/kubosho_">@kubosho_</a> <a href="https://twitter.com/xl1blue">@xl1blue</a> ホントだ。Animatable: no だった。<a href="http://t.co/JopFQtOO5F">http://t.co/JopFQtOO5F</a></p>&mdash; 越智 (@o_ti) <a href="https://twitter.com/o_ti/status/555696632675594240">2015, 1月 15</a></blockquote>

なん…だと…？

というわけで、background-image は仕様的にはアニメーション不可能なプロパティなのですが、Chrome が仕様に準拠していないという事でした。

というわけで、以下のように書き直しました。

## クロスフェードされるように書き直したコード

### HTML

```html
<div class="test-01">
  <img src="http://lorempixel.com/400/200/cats/1" alt="" />
  <img src="http://lorempixel.com/400/200/cats/2" alt="" />
</div>
```

### CSS

```css
.test-01 img:first-child {
  -webkit-animation: crossfade 5s linear 0s infinite alternate;
  animation: crossfade 5s linear 0s infinite alternate;
}

@-webkit-keyframes crossfade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
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

[確認用の jsfiddle はこちら。](http://jsfiddle.net/bo5rj0b5/7/)
