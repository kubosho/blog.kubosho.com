---
title: 神獄のヴァルハラゲートの CSS 設計
excerpt: CSS Architecture Advent Calendar 2014 9 日目の記事になります。
categories: [技術]
tags: [CSS]
publishedAt: 2014-12-09T00:00:00.000Z
revisedAt: 2022-11-28T15:23:32.345Z
---

[CSS Architecture Advent Calendar 2014](http://www.adventar.org/calendars/337) 9 日目の記事になります。

[神獄のヴァルハラゲート](http://grani.jp/product/valhalla-gate/)の CSS 設計方法について振り返りつつ、こうしているということや、上手くいったところ、改善したいところを書いていこうと思います。

## アプリの規模

ASP.NET MVC を使っていて、View 側は Razor テンプレートを使っているのですが、Razor のファイルを検索してみると以下の量となります。

```shell
find ./ -name "*.cshtml" | wc -l
    1674
```

実際には、これにフィーチャーフォン向けのファイルや、部分的な View ファイルも含まれています。

なので、実際 CSS を適用しているファイルの量は、この検索結果よりは格段に減りますが、それでも、約 600 ファイルはあると思います。

ちなみに、今年のはじめに同僚の[@mayuki](https://twitter.com/mayuki)が、[ソーシャルゲームのフロントエンドと ASP.NET MVC (Lite)](https://speakerdeck.com/mayuki/sosiyarugemufalsehurontoendotoasp-dot-net-mvc-lite)というタイトルで、[めとべや東京#3 (Room metro Tokyo #3)](http://partake.in/events/a531c0be-e8dd-46fe-a73c-e51d8ad7a69b)にて発表したのですが、そこには「View 数は 400 超」と書いてあるので、1 年間の運用で約 200 ファイル増えたことになります。

## 対応端末、ブラウザー

スマートフォンでは、以下の環境でアクセスされることを想定して対応しています。

### OS

- iOS 6 or later
- Android 2.3.x
  - 重要な機能だったら、Android 2.2.x にも対応することも…
- Android 4.0 or later

### ブラウザー

- iOS
  - Safari
  - WebView
- Android
  - Android Browser
  - Google Chrome
  - [S Browser](https://gist.github.com/uupaa/b25c9cf47bbeedea5a7f)

iOS 6 や Android 2 系はそろそろ対応端末から外したいなと思っています。来年の今頃は対応しなくて良くなってたらいいですね。

## 命名規則

[BEM](https://en.bem.info/method/naming-convention/)を採用しています。ただし、セレクタの命名規則は以下のように変えています。

```css
[prefix]-[block]_[element]-[[Modifier-Key]-[Modifiler-Value]] {
  // property: value;
}
```

[今年のネーミングルール #CSS 設計 - < /gecko >](http://geckotang.tumblr.com/post/104065014321/css)とだいたい同じですが、以下の点が異なります。

- Block と Element の区切り文字は「\_(アンダースコア)」
- 複数の単語を連結する場合は「-(ハイフン)」を使う
- Modifier は CamelCase を使う。例は以下の通り
  - foo-Bar-Baz (\[block]-\[Modifier-Key]-\[Modifier-Value])
  - foo*bar-Baz (\[block]*\[element]-\[Modifier-Value])
- prefix は、共通で使うルールセットはプロジェクトのコードネーム、各機能のみで使うルールセットはその機能名を使う
  - ガチャなら prefix は`gacha`という感じ

あとは、[hiloki/flocss](https://github.com/hiloki/flocss#mindbemding)の MindBEMding の章にあるように、JavaScript で操作されるような「状態」を表すような Modifier については、SMACSS の State パターンの命名のように、`is-*`プレフィックスを付けて`.is-active`という感じにしています。

`.is-active`には直接スタイル指定をすることを禁止しています。

```sass
// これはOK
.block_element.is-active {
  display: block;
}

// これはNG
.is-active {
  display: block;
}

```

### 良いところ

- `--`や`__`という区切り文字より、セレクタ名が醜くならない(個人の主観です)

あとは構造が分かりやすいだったり、class 名が衝突するということが少ないという、BEM や MindBEMding を採用した人ならだいたい感じることでしょうか。

### 改善したいところ

- prefix のところで世代管理をしなかったのは間違いだった
  - [今年のネーミングルール #CSS 設計 - < /gecko >](http://geckotang.tumblr.com/post/104065014321/css)を読んで気づいた…
  - 古いセレクタ名と、上記の命名規則を適用したセレクタ名が混ざっていて、辛くなることがある
- Modifier を使っている class 名で、Modifier-Key がない class 名というのは、分かりにくいのではと思った
  - この章を書いて気づいた…

## ディレクトリ構成

[hiloki/flocss](https://github.com/hiloki/flocss) に基本は準拠しています。「基本は」と書いたのは以下のディレクトリ名を自分の好みで変えているからです。

- foundation -> base
- object/project -> object/page

## 使っている CSS プリプロセッサーやライブラリー

- LESS
- Normalize.css

LESS な理由ですが、[ソーシャルゲームのフロントエンドと ASP.NET MVC (Lite)](https://speakerdeck.com/mayuki/sosiyarugemufalsehurontoendotoasp-dot-net-mvc-lite?slide=7)の 7 ページにも書いてあるように、Visual Studio との相性が良かった(新規ファイル作成時に\*.less 形式でのみファイルが作れた)ことが要因です。

とはいえ、MSDN Blogs の[Announcing new Web Features in Visual Studio 2013 Update 2 CTP2](http://blogs.msdn.com/b/webdev/archive/2014/02/25/announcing-new-web-features-in-visual-studio-2013-update-2-ctp2.aspx)にも書かれているように、Visual Studio 2013 Update 2(ちなみに今は Update 4 が最新)から公式に Sass(\*.scss 形式)のファイルも新規作成できるようになったので、Visual Studio ユーザーでも好みで LESS か Sass かを選べるようになったと言えます。

ライブラリーは Normalize.css くらいしか使っていないです。これはやはり同僚の@mayuki が入社したての頃に、汎用 class をゴリッと書いてくれたので、ライブラリーを使う理由があまり無くなったという感じです。

## CSS プリプロセッサーの機能について

### extend

[CSS プリプロセッサの Extend - hiloki/flocss](https://github.com/hiloki/flocss#css%E3%83%97%E3%83%AA%E3%83%97%E3%83%AD%E3%82%BB%E3%83%83%E3%82%B5%E3%81%AEextend)に書かれているように、モジュールで完結する extend は許容し、それ以外は禁止しています。むやみに extend を多用すると、どこにそのルールセットが書かれているか分からなくなり破綻する、というのが大きな理由です。

### ルールセットの入れ子

CSS プリプロセッサーのほとんど(全て？)はルールセットの入れ子がおこなえますが、入れ子の深さは二段階までと定めています。具体例としては以下のコードです。

```sass
.foo {
    border: 1px solid #003760;
    color: #000;
    background: rgba(0, 0, 0, 0.5);

    .nest-01 {
        font-weight: bold;

        .nest-02 {
            color: #f00;
        }
    }
}
```

なぜ、二段階までに抑えているのかというと、制限がなかった場合、出力後の CSS のセレクタ部分がとても長くなってしまう可能性があるということが挙げられます。

具体例を書くと、以下のような LESS のコードがあったとします。

```sass
// Uuuugly!
.foo {
    .nest-01 {
        .nest-02 {
            .nest-03 {
                .nest-04 {
                    .nest-05 {
                        color: #333;
                    }
                }
            }
        }
    }
}
```

上記のコードを CSS にコンパイルした場合、以下のようになるでしょう。非常に長くて醜いです。

```css
.foo .nest-01 .nest-02 .nest-03 .nest-04 .nest-05 {
  color: #333;
}
```

また、実際に挙動を確かめられていないですが、多くのサイトで「ブラウザーのセレクターの解釈として、右から左に解釈される」と書かれています。

とすると、上記の CSS は「.nest-05 -> .nest-04 -> .nest-03 -> .nest-02 -> .nest-01 -> .foo」と解釈されることになります。「.nest-01 -> .foo」という構造よりも解釈に時間がかかりそうです。

ちなみに、古い記事(2011 年)ですが、[CSS セレクタによる高速化、実際のところ « LINE Engineers' Blog](http://developers.linecorp.com/blog/?p=178)に実際の計測結果が掲載されており、そこには以下のように書かれています。

<blockquote>
・スタイルを当てる要素にはできるだけclass又はIDを指定する<br>
・子孫セレクタは重いのできるだけ減らす<br>
という施策に一定の効果はあるようですが、その効果が如実に現れるのはHTML、CSSのコードが非常に大きいページに限られるようです。<br>
そのなかでも、子孫セレクタを減らす施策よりも、スタイルを当てる要素にはできるだけclass名を指定する施策のほうが、効果があるようです。
</blockquote>

ということで、MindBEMding の考え方を適用し、ある Block の中でスタイルを当てたい要素には、.block_element だったり、.block_element-Key-Value という感じで class 名を指定し、スタイルを適用しています。

## まとめ

ソーシャルゲームというのは、最初から機能が数十種類あったり、View のファイル数が数百ファイルを超えるということは珍しくないと思います。

そんな中で、CSS を書く上での指針がないと、時間が経つにつれ運用が苦痛になってきます。

例えば新しい人が入ってきたり、自分に何かあって他の人が一時的にプロジェクトに入ってきた場合、CSS を書く上での指針が無いと、どのように CSS を書いていけばいいのか、理解に時間がかかることになります。

なので、CSS を書く上での指針を定め、かつ、それを GitHub の Wiki など、プロジェクトのメンバーが目に入る場所に残しておくのが重要と、自分は考えています。

明日は、[越智](http://www.adventar.org/users/9)さんです。

## 記事内で紹介した GitHub のリポジトリや記事

- [hiloki/flocss](https://github.com/hiloki/flocss)
- [ソーシャルゲームのフロントエンドと ASP.NET MVC (Lite)](https://speakerdeck.com/mayuki/sosiyarugemufalsehurontoendotoasp-dot-net-mvc-lite)
- [MindBEMding – getting your head ’round BEM syntax – CSS Wizardry – CSS, OOCSS, front-end architecture, performance and more, by Harry Roberts](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- [Announcing new Web Features in Visual Studio 2013 Update 2 CTP2 - .NET Web Development and Tools Blog - Site Home - MSDN Blogs](http://blogs.msdn.com/b/webdev/archive/2014/02/25/announcing-new-web-features-in-visual-studio-2013-update-2-ctp2.aspx)
- [CSS セレクタによる高速化、実際のところ « LINE Engineers' Blog](http://developers.linecorp.com/blog/?p=178)
