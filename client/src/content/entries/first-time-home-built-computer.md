---
title: 自作 PC を組んで運用し始めてもうすぐ1年が経とうとしている
excerpt: 2019 年の 9 月頃に自作 PC を組んで運用をおこなっているが、自作 PC について Twitter でしか書いてなかったため、ブログにも書いて自作 PC はいいぞというのを伝えていきたい。
categories: [人生]
tags: [Windows]
publishedAt: 2020-06-09T00:00:00.000Z
revisedAt: 2022-11-28T14:52:15.453Z
---

2019 年の 9 月頃に自作 PC を組んで運用をおこなっているが、自作 PC について Twitter でしか書いてなかったため、ブログにも書いて自作 PC はいいぞというのを伝えていきたい。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">現在のPCの状況 <a href="https://t.co/pHfMaHdMjI">pic.twitter.com/pHfMaHdMjI</a></p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1273271843864973312?ref_src=twsrc%5Etfw">June 17, 2020</a></blockquote>

## なぜ自作 PC を組もうと思ったか

2019 年で 30 歳を迎えるにあたって、せっかくだし前から興味はあったけど難しそう・お金がかかりそうという点で手を出せていなかった自作 PC に手を出そうと思ったから。

## 自作 PC のスペック

スペックは次の通り。合計すると 227,983 円だった。\
なるべく数年は使えるものを買おうと思って、買っていたらこうなった。\
ただ改めて見てみると、自分でもなんでこんなにお金がかかっているんだという気持ちになった。

| パーツ             | 名前                              | 購入時の値段                    |
| ------------------ | --------------------------------- | ------------------------------- |
| CPU                | AMD Ryzen 7 3700X                 | ¥42,984                         |
| メモリ             | CORSAIR CMW32GX4M2C3200C16        | ¥21,796                         |
| マザーボード       | ASRock X570 Taichi                | ¥35,653                         |
| SSD-1              | WesternDigital WDS500G1B0C-EC     | ¥7,980                          |
| SSD-2              | CFD CSSD-M2B1TPG3VNF              | ¥0 <a href="#footnote-1">※1</a> |
| グラボ             | MSI GeForce RTX 2060 AERO ITX 6G  | ¥41,432                         |
| ケース             | CORSAIR CC-9011133-WW             | ¥11,860                         |
| 電源               | 玄人志向 KRPW-GK550W/90+          | ¥6,600                          |
| OS                 | Microsoft Windows 10 Pro 日本語版 | ¥27,860                         |
| キャプチャーボード | elgato 4K60 Pro MK.2              | ¥31,818                         |

## 自作 PC を組んだ感想

正直 PC を組むのはもうちょっと難しいと思っていたが、マザーボードに付属していた説明書を見ながらやったら割と簡単に組めた。\
ミニ四駆を作ったことがある人であれば、多分自作 PC を組めると思う。

難しかったのは組む以前のパーツ選定のほうが難しかった。性能と値段のバランスがいい感じになるパーツを相性を気にしつつかなり探し回っていた…

あと自作 PC には[IKEA 効果](https://en.wikipedia.org/wiki/IKEA_effect)があるなと感じる。自分が組み立てた PC は最高である。

## 実際に運用した感想

とにかく快適そのもの。CPU・GPU を使った処理が重いと感じることもなく、また記憶装置へのアクセスも遅いと感じたことがない。\
これだけでも自作 PC を組んで良かったと思っている。

メモリは 32GB 積んでいるけど、これだけ積むとメモリを食う Google Chrome や[WSL 2 を使っていると Vmmem がメモリを食いまくるバグ](https://github.com/microsoft/WSL/issues/4166)が気にならなくなる。

また CPU クーラー・メモリ・マザーボードが光るものとなっているが、正直光るのが楽しい。

## これから

個人的にはもうちょっと光らせてもいいかなと思い、[Cooler Master: MasterFan MF120 Halo](https://apac.coolermaster.com/jp/cooling/case-fan/masterfan-mf120-halo/)というケースに取り付けるファンを買った。\
電源も Seasonic 製の物に替えてみたいなとは思うが優先度は低い。

またスペックを余らせてしまっているので、VR の開発や高スペックを求められる PC ゲームに手を出したいとは思っている。

## おまけ: 自作 PC を組んでいる様子

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">自作PCを組もうと思ったらCPUを買い忘れていた</p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1175211827195568128?ref_src=twsrc%5Etfw">September 21, 2019</a></blockquote>
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Ryzen 7 3700Xを買ってある程度組んだ。この後電源の配線という面倒な作業がある… <a href="https://t.co/rBQxorZpKo">pic.twitter.com/rBQxorZpKo</a></p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1175457876011147264?ref_src=twsrc%5Etfw">September 21, 2019</a></blockquote>
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">ようやく組み終わった。いい感じに動いているっぽい <a href="https://t.co/oTWX5cu51F">pic.twitter.com/oTWX5cu51F</a></p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1175815348047642624?ref_src=twsrc%5Etfw">September 22, 2019</a></blockquote>
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">自作PCの配線がどんどんきれいになっていく <a href="https://t.co/uhZs1BO00h">pic.twitter.com/uhZs1BO00h</a></p>&mdash; kubosho (@kubosho_) <a href="https://twitter.com/kubosho_/status/1185967932917997569?ref_src=twsrc%5Etfw">October 20, 2019</a></blockquote>

コードはケースの裏側で配線したほうが、空気の流れが改善されてより各パーツを冷やしやすくなる…はず。

<ul>
  <li id="footnote-1">※1 2019年の誕生日のときにAmazonギフト券を大量にもらい、そのギフト券で買ったため実質無料で手に入れたと言える</li>
</ul>
