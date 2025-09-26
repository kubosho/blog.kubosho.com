---
title: fs.exists()がdeprecatedになった理由
excerpt: wearefractal/vinyl-fs の dest(folder, \[opt]) が出力先のディレクトリが無い場合でも、そのディレクトリを作ってくれないということで、自分で「ディレクトリの有無を確認して、無い場合はディレクトリを作る」という処理を作る必要がでてきました。
categories: [技術]
tags: [Node.js]
publishedAt: 2015-09-20T00:00:00.000Z
revisedAt: 2022-11-28T15:34:34.081Z
---

[wearefractal/vinyl-fs](https://github.com/wearefractal/vinyl-fs) の `dest(folder, [opt])` が出力先のディレクトリが無い場合でも、そのディレクトリを作ってくれないということで、自分で「ディレクトリの有無を確認して、無い場合はディレクトリを作る」という処理を作る必要がでてきました。

そこで [File System Node.js v4.1.0 Manual & Documentation](https://nodejs.org/api/fs.html) を見て、ディレクトリの有無を確認するのに使えそうな [fs.exists()](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) というAPIを見つけたのですが、「Deprecated: Use fs.stat or fs.access instead.」ということで、他のAPIを使うように書かれていました。

「ファイルの有無を確認するAPIがdeprecatedになるのはなぜ？」と疑問に思い、調べた結果をまとめます。

## 本題

まず `fs.exists()` ですが、ドキュメントを見ると下記のようなコードが載っています。

```javascript
fs.exists('/etc/passwd', function (exists) {
  console.log(exists ? "it's there" : 'no passwd!');
});
```

この中のcallback関数を見ると、引数として、与えられたパスが存在しているかどうかを示す真偽値が入っていますが、この引数の形式が他のFile SystemのAPIのように `err` が第一引数になっていないため、規則に沿っていないということで、[fs.exists does not follow node conventions · Issue #8369 · nodejs/node-v0.x-archive](https://github.com/nodejs/node-v0.x-archive/issues/8369#issuecomment-55559828) というissueが作られています。

しかし、2つ目のコメントで事態が変化しています。

[fs.exists does not follow node conventions · Issue #8369 · nodejs/node-v0.x-archive](https://github.com/nodejs/node-v0.x-archive/issues/8369#issuecomment-55559828)

この2つ目のコメントについてはid:yosuke_furukawaの投稿を見たほうがどういうことか分かりやすいです。

<blockquote class="twitter-tweet" lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/kubosho_">@kubosho_</a> exists はrace condition に沿わないのでdeprecatedですね。存在チェックした後で消されたらどうするのっていう。普通に読み書きしたエラーでいいはずだし、どうしてもチェックしたかったらaccessかstatを使うというのが通例ですね。</p>&mdash; Yosuke FURUKAWA (@yosuke_furukawa) <a href="https://twitter.com/yosuke_furukawa/status/645260394592759808">2015, 9月 19</a></blockquote>

この投稿の「存在チェックした後で消されたらどうするの」というのを処理の流れに落としこむと、`fs.exists()` で与えられたパスが存在しているか確認し、`fs.exists()` のcallback関数内で `fs.unlinkSync(path)` としてファイルを削除した後に、callback関数の `exists` 引数を使って `exists` がtrueだったら、ファイルを開くというソースコードを書いて実行すると `no such file or directory` のエラーが出力されます。

実際のソースコードは下記の通りとなります。これなら `fs.open(path, "r", callback)` として、ファイルの有無で処理を分けたほうが入れ子を浅くできます。

<script src="https://gist.github.com/kubosho/c19c2267bf4715ba80d2.js"></script>

話を「Nodeの規則に沿っていないというissueが作られた」というところに戻すと、issueでやりとりがあった後、[fs: deprecate exists() and existsSync() by cjihrig · Pull Request #8418 · nodejs/node-v0.x-archive](https://github.com/nodejs/node-v0.x-archive/pull/8418) というPull Requestが作られます。

このPull Requestは元のタイトルが「fs: add errback style support to exists()」とあるように、[互換性を保ちつつ、callback 関数の第一引数に error が入るようにしたもの](https://github.com/cjihrig/node/commit/aeb381ccf6f72546e4ad1a3615d29f52f49dacf4)がコミットされていました。

Pull Request内でコードレビューがおこなわれ、[Function.length のパフォーマンスが悪い](http://jsperf.com/function-length-performance/8)という指摘があったりしたのですが、それらの指摘を踏まえてPull Requestをopenしたcjihrig氏は[いくつか提案をしています](https://github.com/nodejs/node-v0.x-archive/pull/8418#discussion_r17825801)（何もしない、互換性がある、または壊す形で第一引数の `err` をサポートする)。

しかし、再び事態が変わります。[`fs.exists()` を deprecate にして代わりに `fs.access()` を使うようにする](https://github.com/nodejs/node-v0.x-archive/pull/8418#discussion_r17825997)というコメントがされました。

そして、そのコメントが流れを変えて、`fs.exists()` は第一引数の `err` がサポートされることなくdeprecatedになりました。

<blockquote class="twitter-tweet" lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/kubosho_">@kubosho_</a> そうですね。その例の他にもNodeと無関係な全く別なプロセスからファイルが削除される事もあるから、exists =&gt; read みたいな事やろうとするのって筋悪なんですよね。突き詰めていくとexists自体の必要性が怪しくて、deprecatedっていう。</p>&mdash; Yosuke FURUKAWA (@yosuke_furukawa) <a href="https://twitter.com/yosuke_furukawa/status/645276523625234433">2015, 9月 19</a></blockquote>

## まとめ

「ディレクトリの有無を確認して、無い場合はディレクトリを作る」という処理を作るために `fs.exists()` を使おうとしたらdeprecatedになっていて、なぜだろうと思い調べたら、`fs.exists()` がdeprecatedになった経緯が分かった話でした。結果として「ディレクトリの有無を確認して、無い場合はディレクトリを作る」という処理は「ディレクトリを作るように試み、既に存在したら（エラーになったら）作らない」という処理になりました。

具体的なソースコードとしては、最初は `fs.exists()` を使っていたため、下記のようなソースコードでした。

<script src="https://gist.github.com/kubosho/d4052651a1c8b8153a5b.js"></script>

これを「ディレクトリを作るように試み、既に存在したら（エラーになったら）作らない」という考え方で書き換えて下記のようにしました。

<script src="https://gist.github.com/kubosho/d26ef7da6c399c318365.js"></script>

結果的に、`fs.exists()` というdeprecatedになったAPIを使う必要がなくなり、また入れ子は浅く、ソースコードも短くなりました。
