---
title: なぜ CSS や Grunt はつらいと言われるのか
categories: [技術]
tags: [CSS]
publishedAt: 2015-11-12T00:00:00.000Z
revisedAt: 2022-06-21T06:22:54.673Z
---

少し主語を大きく書いてしまいましたが、`*.css` と `gruntfile.js` についての話です。

「[CSS に死を！](http://0-9.sakura.ne.jp/pub/kbkz_tech/start.html)」と言われたり、「[CSS 勉強するのはだるい](http://mizchi.hatenablog.com/entry/2014/12/28/160715)」と言われたりしますが、これらを見ていると「Gruntがつらい」という話と共通項があると感じました。

## どちらも設定ファイルである

自分の考えとして前提を書くと「`*.css` と `gruntfile.js` はそれぞれ「どのような見た目にするか」「どのようなタスクを実行するか」を定義するための設定ファイルである」という考えです。

その前提のもと、設定ファイルであるという利点と欠点をこれから書いていきます。

### 利点

#### 少ない行数の時の見やすさ

`*.css` や `*gruntfile.js` は200-250行くらいまでなら、ソースコードの全体が少ない時間で把握でき、何をしているものなのかすぐに分かります。

#### 敷居の低さ

CSS・Gruntともに、ブログやQiitaなどに上がっているソースコードをコピペしてくれば、なんとなくそれっぽい見た目になったり、タスクが実行できるようになります。

### 欠点

#### 破綻しやすい

CSSはすぐに、無計画にルールセットを増やしたことによるファイルサイズの肥大化、スタイルの思いもよらぬ上書き（それに伴う !important地獄）、必要ないルールセットの放置などが発生します。

Gruntも、無計画にタスクを増やしたことによるファイルサイズの肥大化、必要ないタスクの放置が発生しやすいと感じます。

ファイルサイズの肥大化については、CSS・Gruntともにファイルを分割すれば良いという話ですが、CSSは @importを使うとCSSファイルの読み込みが並列でおこなわれないため、全てのCSSファイルを読み込むための時間がかかってしまう問題を抱えています。

また、GruntもloadTasks() を使えば別ファイルに分割したタスクを読み込むことはできます。しかし、定義されているタスクの一覧性が悪くなるということと、読み込んだタスクが何をやっているのかを見るのが若干面倒という問題を抱えています。

#### 手法が複数ある

CSSはMindBEMdingだったり、SUIT CSSだったり、セレクタの設計手法が複数あります。

また、画像置換の手法についても、昔ながらの `text-indent: -9999px;` とする手法から、[`text-indent` `white-space` `overflow` を組み合わせる手法](http://www.zeldman.com/2012/03/01/replacing-the-9999px-hack-new-image-replacement/)、[擬似要素を使う手法](http://nicolasgallagher.com/css-image-replacement-with-pseudo-elements/)など複数あります。

Gruntも例えばSassをCSSにコンパイルしたいといった時に、[gruntjs/grunt-contrib-sass](https://github.com/gruntjs/grunt-contrib-sass) を使えば良いのか、[sindresorhus/grunt-sass](https://github.com/sindresorhus/grunt-sass) を使えば良いのか、分からなくなります。

複数ある手法から最適解を求めたいところですが、そこに至るまでの時間が長くなりがちで、それがだるさに繋がります。

## CSS が gulp から学べる点はなんなのか？

と、書いてみたものの、特に思い浮かばないので、ここは任せました。
