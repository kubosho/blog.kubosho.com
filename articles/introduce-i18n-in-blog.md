---
title: ブログを国際化対応した
categories: [技術]
tags: [i18n, ブログ]
publishedAt: 2022-06-16T00:00:03.004Z
revisedAt: 2022-11-28T13:57:24.766Z
---

当ブログのUIで使う文言を国際化対応しました。

[Introduce i18n by kubosho · Pull Request #933 · kubosho/blog.kubosho.com](https://github.com/kubosho/blog.kubosho.com/pull/933)

国際化対応には[rosetta](https://github.com/lukeed/rosetta)という軽量の国際化対応ライブラリーを使いました。

文言だけを各言語に対応させる分には必要なAPIが揃っていたのと、bundle sizeが426バイトだったのでJavaScriptのサイズが大きくならないのも良いと思い、rosettaを選択しました。

きっかけとしては、Androidアプリでの開発ではLintで文字列に都度IDを振って文字列リソースとして記載するよう指摘される旨の投稿を見て、Webでも同じ対応を入れていいはずと感じたためやりました。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Androidはこの辺しっかりしてて、「文字列は都度IDを振ってres/values/strings.xmlに文字列リソースとして記載しなさい」というのがAndroid Lintの指摘事項になってるんだよね。おかげで日本語をUIの中にベタ書きしない習慣を身につけやすい。<br>（まあ僕もWebだとベタ書きしてしまうのだけど） <a href="https://t.co/ZSONvK7u1d">https://t.co/ZSONvK7u1d</a></p>&mdash; なかざん💉💉💉 (@Nkzn) <a href="https://twitter.com/Nkzn/status/1531110969073537024?ref_src=twsrc%5Etfw">May 30, 2022</a></blockquote>

正直あまり深く考えずにやれそうだからやりますわ～という感じでやりました。

感想としては、文言が特定のディレクトリに集約されたため、文言を変えるときに作業が楽になるなと感じました。

多言語対応という意味では現状日本語しか対応していないため、国際化対応によって何か得られたというのは無いです。

今後はブログの記事も多言語で書けるようになっていきたいです。
