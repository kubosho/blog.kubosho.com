---
title: CSSを破綻させない
excerpt: 12/3（土）にCSS を破綻させないという内容をbuilderscon tokyo 2016で話しました。
categories: [技術]
tags: [CSS]
publishedAt: 2016-12-14T00:00:00.000Z
revisedAt: 2022-11-28T15:18:37.222Z
---

12/3（土）に[CSS を破綻させない](https://builderscon.io/builderscon/tokyo/2016/session/720e29c6-9b11-46f3-adf4-f6f52e4fcbb9)という内容を[builderscon tokyo 2016](https://builderscon.io/builderscon/tokyo/2016)で話しました。

そこで使った発表資料の内容を編集した上で、[CSS Advent Calendar 2016](http://qiita.com/advent-calendar/2016/css) 14 日目の記事として公開します。

## CSS は破綻しやすい

OOCSS の提唱者 Nicole Sulliban 氏も["CSS is too fragile"](http://www.andoh.org/2009/11/web-directions-east-2009-nicole.html)と 2008 年のイベントで言いました。\
なぜ破綻しやすいのか。それは CSS の特性が絡んでいます。

## CSS の特性

CSS の特性としておもに 3 つあります。

はじめに、記述を間違えてもエラーにならないことです。ブラウザで表示確認をおこなって初めて見た目がおかしいことに気づきます。

次に、スタイルが適用される条件としてルールセットを書く順序は関係ありますが、常に関係があるわけではない点です。

ちなみにルールセットは CSS のセレクタ・プロパティ・値の定義をまとめたものです。\
分かりやすい図として[CSS ルールセット構造図 · terkel.jp](http://terkel.jp/archives/2011/09/css-rule-structure/)内の画像があるので引用します。

![CSSのルールセットの図](//blog-assets.kubosho.com/css-rule-set.png)

最後に、ルールセット間で同じプロパティが定義されている場合、順序・詳細度・重要度にもとづいて適用されるスタイルが決定されます。CSS をややこしくしているのはここですが、意識して書かないと容易に破綻します。

ここからは実際に CSS が破綻した例を見ていきます。

## CSS の破綻

CSS の破綻はいくつか種類があります。これらの要素のうち 2 つ以上が複合して起きていると手がつけられない CSS になります。

### スタイルの上書きが複数ある

スタイルの上書きは Bootstrap など CSS フレームワークを使うときに独自の見た目を実現しようとすると起こりがちな問題です。\
スタイルの上書きが多くなるとどんな見た目になるのか予測できなくなり破綻します。

```css
.button {
  border: 1px solid #ccc;
}

/* ...長いコードの後や別ファイルなど... */

.button {
  border: 1px solid #666;
}

/* ...長いコードの後や別ファイルなど... */

.article .button {
  border: 1px solid #00c;
}
```

### 前に書いたセレクタの詳細度が高い

前に書いたセレクタの詳細度が高くてスタイルが上書きできないことも破綻の一因になります。\
先ほどのスタイルの上書きを多くしていると起こりがちな問題です。\
これがもたらす結果としては `!important` の濫用です。

```css
/* 詳細度はa=0, b=4, c=0なので0.4.0となる */
.container .form .form-group .form-submit-button {
}

/*
  詳細度はa=0, b=1, c=0なので0.1.0となる
  上書きできない。つらい
*/
.form__submit-button {
}
```

### 命名規則がバラバラ

よくあることとして単語の区切りがケバブケース・キャメルケース・スネークケースのようにバラけていると、どの規則に合わせればいいのか分からずいつまでも命名規則が統一されません。

```css
.account-login-button {
}

.commentSubmitButton {
}

.form_submit_button {
}
```

## CSS の破綻 まとめ

ここまで CSS が破綻する理由について書きました。まとめると次のとおりです。

- 詳細度が管理されていない
- ルールセットの分割粒度が明確ではない
- 命名規則が決まっていない

## CSS を破綻させない

ここからは CSS を破綻させないためにはどうすればいいのかを書いていきます。

### 詳細度を管理する

CSS などのファイルを分割するときはファイル内で下へ行くにつれて詳細度が高くなるようにします。またセレクタ定義や ID セレクタを書きすぎないようにするのも重要です。

例を挙げるとフォーム共通のスタイルを適用するときにセレクタを定義しすぎないことです。\
これにより少ないセレクタ定義で適用したスタイルを上書きできて秩序が保つことができます。

```css
/* 詳細度はa=0, b=2, c=0なので0.2.0となる */
.form .form-button {
  margin: 0;
}

/* ... */

/*
  詳細度はa=0, b=2, c=0なので0.2.0となる
  記述の順序が後なので値が上書きされる
*/
.comment-form .form-button {
  /* 上書きできる */
  margin: 10px auto;
}
```

### ルールセットの分割粒度を明確にする

スタイルの上書きを減らすためにルールセットの分割粒度を明確にすることも重要です。\
これはさまざまな方法が提案されていて、たとえば[FLOCSS](https://github.com/hiloki/flocss)や[SMACSS](https://smacss.com/)、[ECSS](http://ecss.io/)などがあります。

これは作るものによって適しているものが違うため一概にどれがいいか言えません。\
スタイルを適用したいときにルールセットをどこに置けばいいのかチーム内で迷わないようにするのが重要です。

### 命名規則を決める

命名規則も[MindBEMding](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)や[ECSS](http://ecss.io/chapter5.html#h-H2_1)、[SMACSS](https://smacss.com/book/categorizing)などさまざまなものがあります。これもチーム内で使う命名規則を一致させることが重要です。

## CSS を破綻させない まとめ

ここまで CSS の破綻を起こさないためにどうしたらいいか書きました。まとめると次のとおりです。

- 詳細度を管理する
- チーム内でルールセットの分割粒度を明確にする
- チーム内で命名規則を決める

しかしこれらを実践する前により大事なことが 1 つあります。\
それは<strong>デザイナーとの認識合わせ</strong>です。

これは[デザインの意図を正確に理解した上で書かれた CSS は破綻しない](http://morishitter.hatenablog.com/entry/2016/07/29/204642)という言葉があります。

デザイナーが作った Sketch や Photoshop のファイルを見て質問や提案をおこない、デザイナーと UI を実装する人で意図の認識を合わせることが重要です。\
もっと言うなら Sketch や Photoshop などで作る以前のプロトタイピングの段階から関わるとお互い意図の認識がしやすくなると思います。\
プロトタイピングツールは[InVision](https://www.invisionapp.com/)が代表的です。

これを踏まえてまとめると、<strong>チームで議論して良い CSS 設計を考えよう</strong>になります。

## CSS がすでに破綻している場合は？

builderscon の Q\&A で「途中から入ったプロジェクトの CSS が破綻していた場合どう改善したらいいのか？」というのがあったのですが、今のところチームで話し合って設計指針を決めて 1 から書き直すしかないと考えています。

## 参考資料

- [僕は CSS を見殺しにした - dskd](http://dskd.jp/archives/54.html)
- [Enduring CSS の設計思想 - ECSS が目指す設計 | CodeGrid](https://app.codegrid.net/entry/2016-ecss-1)
- [SMACSS による CSS の設計 - ベースとレイアウト | CodeGrid](https://app.codegrid.net/entry/smacss-1)
- [破綻しにくい CSS 設計の法則 15 - Qiita](http://qiita.com/BYODKM/items/b8f545453f656270212a)
- [CSS が破綻する 4 つの理由 - Qiita](http://qiita.com/BYODKM/items/8c777db2d89f4e830c93)
