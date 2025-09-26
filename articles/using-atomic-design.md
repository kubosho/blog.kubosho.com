---
title: Atomic Designの考え方と利点・欠点
excerpt: Atomic Design はデザインシステムを作る方法論となります。
categories: [技術]
tags: [Atomic Design]
publishedAt: 2016-07-19T00:00:00.000Z
revisedAt: 2022-11-28T15:18:44.351Z
---

Atomic Designはデザインシステムを作る方法論となります。デザインシステムというのはスタイルガイドやブランドのガイドラインなどを指すようです。

日本だと[AbemaTV（アベマ TV）](https://abema.tv/)で使われています。（[Atomic Design を実案件に導入 - UI コンポーネントの粒度を明確化した結果と副産物 | ygoto3.com](http://ygoto3.com/posts/atomic-design-on-actual-project/)より）

Atomic Designは今までのページ単位と違いコンポーネント単位でデザインカンプを作る考え方です。作ったコンポーネント同士の組み合わせでページを作ります。

Atomic Designはコンポーネントの単位を5つに分けています。その5つの単位はAtoms（原子）・Molecules（分子）・Organisms（有機体）・Templates（テンプレート）・Pages（ページ）です。各コンポーネントの詳細は次のとおりです。

## Atoms（原子）

Atoms（原子）は、UIを構成する基礎的な要素が該当します。

フォームでいうと、画像で示すようにラベル・入力部分・ボタンの各要素がAtomsとなります。他の要素では、カラーパレットやフォント、アニメーションがAtomsに入ります。

![Atomsを指した図。フォームのラベル・入力フォーム・ボタンがAtomsとなる](//blog-assets.kubosho.com/atoms.png)

Atomsに振り分ける基準としては、**対象の要素が機能的にそれ以上分割できない** 場合、Atomsへ振り分けます。フォームで例えると、ラベルはそれ以上機能的に分割できません。また入力フォームやボタンもそれ以上機能的に分割できません。

Atoms単体だと抽象的でどういう意味を持つかは分からないです。入力フォームだけ見ても、それがアカウント登録フォームもしくはコメント入力フォームという情報は読み取れません。

Atomsはコンポーネントの基礎部分になります。それは、Atomsを組み合わせてより大きなコンポーネントを構成するという点から言えることです。

またAtomsを俯瞰できるページを用意しておくことで、そのページがどのようにデザインされたかという雰囲気を感じ取ることができます。それによりページデザインに一貫性を持たせることができます。

## Molecules（分子）

Molecules（分子）は、Atomsを組み合わせて作る要素です。このAtomsを組み合わせてMoleculesを作るというのは「単一責任の原則」やUNIX哲学の「1つのプログラムは1つのことをうまくやる」に基づいているようです。

Moleculesになることで意味を持つ要素となります。たとえば、Atomsであるラベル・入力フォーム・登録ボタンという3つのコンポーネントがあってもそれら単体は意味をなしません。しかし、これらの要素を組み合わせることにより「ラベルで示したことに応じて、入力フォームに何かを書いて、登録ボタンを押す」という意味が示せるようになります。

![Moleculesを指した図。フォームのラベル・入力フォーム・ボタンをまとめたものがMoleculesとなる](//blog-assets.kubosho.com/molecules.png)

Moleculesはできるだけ単純にして、再利用性やUIの一貫性を高めます。

## Organisms（有機体）

Organisms（有機体）は、AtomsやMolecules、また他のOrganismsを組み合わせて作る要素です。今までのAtomsやMoleculesとは違い複雑な要素になります。ヘッダーやフッターと呼ばれる要素はこのOrganismsになります。

たとえば画像で示すようなヘッダーは「タイトル」というAtomsと、「ナビゲーション」「SNSのボタン群」というMoleculesが組み合わさって、ヘッダーというOrganismsになっています。

![Organismsを指した図。WebページのヘッダーやフッターなどがOrganismsとなる](//blog-assets.kubosho.com/organisms.png)

Organismsからそのページの特色が出やすくなります。

## Templates（テンプレート）

ここからAtoms（原子）・Molecules（分子）・Organisms（有機体）といった化学的なものに例えることをしなくなります。これは仕事の依頼元や上司・同僚に見せるものということを明確にするため、より一般的な言葉を使います。

Templates（テンプレート）の説明に移ると、Templatesはページ構造を説明するものです。TemplatesはMoleculesやOrganismsを組み合わせて作ります。

Templatesの段階ではページ内容がまだ仮となります。Templatesを言い換えるなら「[ワイヤーフレーム](https://www.google.co.jp/search?q=%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%BC%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0&tbm=isch)」になります。

## Pages（ページ）

Pages（ページ）は、Template内へ実際の文章や画像などが入ったものとなります。

ここまで5つの要素について概要を書きました。要素の振り分けかたについて、どのように考えたらいいかは[Atomic design is for user interfaces](http://atomicdesign.bradfrost.com/chapter-2/#atomic-design-is-for-user-interfaces)内のInstagramで例えたものが分かりやすいです。

## Atomic Design の利点

さて、Atomic Designを実際に適用した結果、次に挙げる3つの利点があると感じました。

### 名前がついている

Atomic Designはコンポーネントの大きさによって、それぞれAtoms・Molecules・Organisms・Templates・Pagesという名前がついています。この名前がついていることで、Atomsは「それ以上分割できないコンポーネント」ということや、Moleculesの「Atomsを組み合わせた意味があるコンポーネント」という特徴が共有されやすくなります。

### デザインの変更に対応しやすくなる

Atomic Designの考え方でコンポーネントを作ると、デザイン変更に対応しやすくなり再利用性も高くなります。特にAtomsやMoleculesへ振り分けられるような細かいコンポーネントはデザイン変更にも強いです。

今回適用したページはそこまでデザイン変更が起こりませんでした。それでもデザイン変更があったときはいつもと比べて他コンポーネントへの影響を考えずに対応できました。

### セレクタの詳細度が平坦に近づく

Atomic Designを適用するとセレクタの詳細度が平坦になるようです。

次の画像は今回Atomic Designの考え方を使って作ったCSSの詳細度を示したグラフですが、割と平坦なグラフになっています。

![神獄のヴァルハラゲートのイベントページのCSSの詳細度を指した図。飛び出すところがあまりない平坦なグラフとなっている](//blog-assets.kubosho.com/css-valhalla.png)

またAtomic Designを採用しているAbemaTVのCSSも突然詳細度が上がることなく平坦なグラフです。ただこれは中の人になって分かったことですが、CSS Modulesの仕組み（css-loader）を取り入れているためCSSは各コンポーネントごとにスコープが閉じた状態で書くことができます。そのためセレクタの詳細度をあまり上げなくてもスタイル宣言をできるため、詳細度が抑えられています。

![AbemaTVのCSSの詳細度を指した図。急に飛び出していない平坦なグラフとなっている](//blog-assets.kubosho.com/css-abematv.png)

## Atomic Design の欠点

利点ばかりではなく、Atomic Designの欠点も見えました。

### デザイナーがどのようにデザインしていけばいいか分からない

Atomic Designは「小さい単位でコンポーネントを作り大きいコンポーネントにしていく」というデザイン手法です。そのため、フロントエンド実装では利点があります。

しかしデザイナーからすると、Atomic Designの考え方でデザインすることは難しそうです。デザイナーにAtomic Designについて説明しましたが、いきなりの手順変更は難しかったため、デザインしてもらうときはコンポーネント単位ではなくページ単位でデザインしてもらう従来の方法をとりました。

デザイナーによるページデザインの段階でAtomic Designを取り入れることに関しては、どうしたらいいのかまだ分かりません。

### 欠点に対しての対応

今回はコンポーネントリストを作りました。以下のjsfiddleではかなり簡略化したリストですが、以下のようにAtoms・Molecules・Organismsとコンポーネントを分けて見せるようにしました。

<iframe width="100%" height="300" src="//jsfiddle.net/bed3aj1k/2/embedded/result,css/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

デザイナーには通常通りページ単位でデザインカンプを作ってもらいました。そして、自分のほうでそのデザインカンプを見つつ、Atomic Designの各単位に要素を切り出し、コンポーネントを作りました。

作ったコンポーネントリストをプランナーやデザイナーに共有しておくことで、実機でどのように表示されるか分かりやすくなることと、開発者にも共有しておくことでコンポーネントを使うことを促し、結果としてコード量や実装の工数を減らすことを目論みました。また、コンポーネントリストは作っておくと、どのようにコンポーネントを分割するか意識できます。

## まとめ

今回初めてAtomic Designの考え方でページを作ってみました。結果としては、思ったより良い感じにハマった感があります。今後もAtomic Designの考え方に照らし合わせてコンポーネントを作り、変更に強く分割されたコンポーネントを作っていきたいです。

## 出典

- [Atomic Design | Brad Frost](http://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/)
- [最近よくクリエイターが移住するカナダで Atomic Design を学ぶ | ygoto3.com](http://ygoto3.com/posts/smashing-conference-whistler-and-atomic-design/)
- [Atomic Design を実案件に導入 - UI コンポーネントの粒度を明確化した結果と副産物 | ygoto3.com](http://ygoto3.com/posts/atomic-design-on-actual-project/)
- [珍しいワークフロー：Atomic Design の原則と Sketch でデザインからプログラミングまで | デザイン | POSTD](http://postd.cc/the-unicorn-workflow-design-to-code-with-atomic-design-principles-and-sketch/)
- [Atomic Design は Web 開発を救うのか - DMM.com ラボ デザイナーズブログ](http://design.dmm.com/entry/2016/02/05/153408)
