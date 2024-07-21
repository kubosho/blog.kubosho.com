---
title: Atomic Designの考え方と利点・欠点
excerpt: Atomic Design はデザインシステムを作る方法論となります。
categories: [技術]
tags: [Atomic Design]
publishedAt: 2016-07-19T00:00:00.000Z
revisedAt: 2022-11-28T15:18:44.351Z
---

Atomic Design はデザインシステムを作る方法論となります。\
デザインシステムというのはスタイルガイドやブランドのガイドラインなどを指すようです。

日本だと[AbemaTV（アベマ TV）](https://abema.tv/)で使われています。\
（[Atomic Design を実案件に導入 - UI コンポーネントの粒度を明確化した結果と副産物 | ygoto3.com](http://ygoto3.com/posts/atomic-design-on-actual-project/)より）

Atomic Design は今までのページ単位と違いコンポーネント単位でデザインカンプを作る考え方です。\
作ったコンポーネント同士の組み合わせでページを作ります。

Atomic Design はコンポーネントの単位を 5 つに分けています。\
その 5 つの単位は Atoms（原子）・Molecules（分子）・Organisms（有機体）・Templates（テンプレート）・Pages（ページ）です。\
各コンポーネントの詳細は次のとおりです。

## Atoms（原子）

Atoms（原子）は、UI を構成する基礎的な要素が該当します。

フォームでいうと、画像で示すようにラベル・入力部分・ボタンの各要素が Atoms となります。\
他の要素では、カラーパレットやフォント、アニメーションが Atoms に入ります。

![Atomsを指した図。フォームのラベル・入力フォーム・ボタンがAtomsとなる](//blog-assets.kubosho.com/atoms.png)

Atoms に振り分ける基準としては、**対象の要素が機能的にそれ以上分割できない** 場合、Atoms へ振り分けます。\
フォームで例えると、ラベルはそれ以上機能的に分割できません。\
また入力フォームやボタンもそれ以上機能的に分割できません。

Atoms 単体だと抽象的でどういう意味を持つかは分からないです。\
入力フォームだけ見ても、それがアカウント登録フォームもしくはコメント入力フォームという情報は読み取れません。

Atoms はコンポーネントの基礎部分になります。\
それは、Atoms を組み合わせてより大きなコンポーネントを構成するという点から言えることです。

また Atoms を俯瞰できるページを用意しておくことで、そのページがどのようにデザインされたかという雰囲気を感じ取ることができます。\
それによりページデザインに一貫性を持たせることができます。

## Molecules（分子）

Molecules（分子）は、Atoms を組み合わせて作る要素です。\
この Atoms を組み合わせて Molecules を作るというのは「単一責任の原則」や UNIX 哲学の「1 つのプログラムは 1 つのことをうまくやる」に基づいているようです。

Molecules になることで意味を持つ要素となります。\
たとえば、Atoms であるラベル・入力フォーム・登録ボタンという 3 つのコンポーネントがあってもそれら単体は意味をなしません。\
しかし、これらの要素を組み合わせることにより「ラベルで示したことに応じて、入力フォームに何かを書いて、登録ボタンを押す」という意味が示せるようになります。

![Moleculesを指した図。フォームのラベル・入力フォーム・ボタンをまとめたものがMoleculesとなる](//blog-assets.kubosho.com/molecules.png)

Molecules はできるだけ単純にして、再利用性や UI の一貫性を高めます。

## Organisms（有機体）

Organisms（有機体）は、Atoms や Molecules、また他の Organisms を組み合わせて作る要素です。今までの Atoms や Molecules とは違い複雑な要素になります。\
ヘッダーやフッターと呼ばれる要素はこの Organisms になります。

たとえば画像で示すようなヘッダーは「タイトル」という Atoms と、「ナビゲーション」「SNS のボタン群」という Molecules が組み合わさって、ヘッダーという Organisms になっています。

![Organismsを指した図。WebページのヘッダーやフッターなどがOrganismsとなる](//blog-assets.kubosho.com/organisms.png)

Organisms からそのページの特色が出やすくなります。

## Templates（テンプレート）

ここから Atoms（原子）・Molecules（分子）・Organisms（有機体）といった化学的なものに例えることをしなくなります。\
これは仕事の依頼元や上司・同僚に見せるものということを明確にするため、より一般的な言葉を使います。

Templates（テンプレート）の説明に移ると、Templates はページ構造を説明するものです。\
Templates は Molecules や Organisms を組み合わせて作ります。

Templates の段階ではページ内容がまだ仮となります。Templates を言い換えるなら「[ワイヤーフレーム](https://www.google.co.jp/search?q=%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%BC%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0&tbm=isch)」になります。

## Pages（ページ）

Pages（ページ）は、Template 内へ実際の文章や画像などが入ったものとなります。

ここまで 5 つの要素について概要を書きました。\
要素の振り分けかたについて、どのように考えたらいいかは[Atomic design is for user interfaces](http://atomicdesign.bradfrost.com/chapter-2/#atomic-design-is-for-user-interfaces)内の Instagram で例えたものが分かりやすいと思います。

## Atomic Design の利点

さて、Atomic Design を実際に適用した結果、次に挙げる 3 つの利点があると感じました。

### 名前がついている

Atomic Design はコンポーネントの大きさによって、それぞれ Atoms・Molecules・Organisms・Templates・Pages という名前がついています。\
この名前がついていることで、Atoms は「それ以上分割できないコンポーネント」ということや、Molecules の「Atoms を組み合わせた意味があるコンポーネント」という特徴が共有されやすくなると思います。

### デザインの変更に対応しやすくなる

Atomic Design の考え方でコンポーネントを作ると、デザイン変更に対応しやすくなり再利用性も高くなります。\
特に Atoms や Molecules へ振り分けられるような細かいコンポーネントはデザイン変更にも強いです。

今回適用したページはそこまでデザイン変更が起こりませんでした。\
それでもデザイン変更があったときはいつもと比べて他コンポーネントへの影響を考えずに対応できました。

### セレクタの詳細度が平坦に近づく

Atomic Design を適用するとセレクタの詳細度が平坦になるようです。

次の画像は今回 Atomic Design の考え方を使って作った CSS の詳細度を示したグラフですが、割と平坦なグラフになっています。

![神獄のヴァルハラゲートのイベントページのCSSの詳細度を指した図。飛び出すところがあまりない平坦なグラフとなっている](//blog-assets.kubosho.com/css-valhalla.png)

また Atomic Design を採用している AbemaTV の CSS も突然詳細度が上がることなく平坦なグラフです。\
ただこれは中の人になって分かったことですが、CSS Modules の仕組み（css-loader）を取り入れているため CSS は各コンポーネントごとにスコープが閉じた状態で書くことができます。\
そのためセレクタの詳細度をあまり上げなくてもスタイル宣言をできるため、詳細度が抑えられています。

![AbemaTVのCSSの詳細度を指した図。急に飛び出していない平坦なグラフとなっている](//blog-assets.kubosho.com/css-abematv.png)

## Atomic Design の欠点

利点ばかりではなく、Atomic Design の欠点も見えました。

### デザイナーがどのようにデザインしていけばいいか分からない

Atomic Design は「小さい単位でコンポーネントを作り大きいコンポーネントにしていく」というデザイン手法です。そのため、フロントエンド実装では利点があります。

しかしデザイナーからすると、Atomic Design の考え方でデザインすることは難しいかもしれません。\
実際、今回デザイナーへ Atomic Design について説明しました。\
ただ、デザインしてもらうときはコンポーネント単位ではなくページ単位でデザインしてもらう従来の方法をとりました。

デザイナーによるページデザインの段階で Atomic Design を取り入れることに関しては、どうしたらいいのかまだ分かりません。

### 欠点に対しての対応

今回はコンポーネントリストを作りました。以下の jsfiddle ではかなり簡略化したリストですが、以下のように Atoms・Molecules・Organisms とコンポーネントを分けて見せるようにしました。

<iframe width="100%" height="300" src="//jsfiddle.net/bed3aj1k/2/embedded/result,css/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

デザイナーには通常通りページ単位でデザインカンプを作ってもらいました。\
そして、自分のほうでそのデザインカンプを見つつ、Atomic Design の各単位に要素を切り出し、コンポーネントを作りました。

作ったコンポーネントリストをプランナーやデザイナーに共有しておくことで、実機でどのように表示されるか分かりやすくなることと、開発者にも共有しておくことでコンポーネントを使うことを促し、結果としてコード量や実装の工数を減らすことを目論みました。\
また、コンポーネントリストは作っておくと、どのようにコンポーネントを分割するか意識することができます。

## まとめ

今回初めて Atomic Design の考え方でページを作ってみました。\
結果としては、思ったより良い感じにハマった感があります。\
今後も Atomic Design の考え方に照らし合わせてコンポーネントを作り、良い感じに変更に強く分割されたコンポーネントを作っていきたいと思います。

## 出典

- [Atomic Design | Brad Frost](http://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/)
- [最近よくクリエイターが移住するカナダで Atomic Design を学ぶ | ygoto3.com](http://ygoto3.com/posts/smashing-conference-whistler-and-atomic-design/)
- [Atomic Design を実案件に導入 - UI コンポーネントの粒度を明確化した結果と副産物 | ygoto3.com](http://ygoto3.com/posts/atomic-design-on-actual-project/)
- [珍しいワークフロー：Atomic Design の原則と Sketch でデザインからプログラミングまで | デザイン | POSTD](http://postd.cc/the-unicorn-workflow-design-to-code-with-atomic-design-principles-and-sketch/)
- [Atomic Design は Web 開発を救うのか - DMM.com ラボ デザイナーズブログ](http://design.dmm.com/entry/2016/02/05/153408)
