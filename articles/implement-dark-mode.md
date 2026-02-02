---
title: ブログにダークモードを実装した
publishedAt: 2026-02-02T03:00:00.000Z
categories:
  - 技術
tags:
  - CSS
  - JavaScript
  - ブログ
  - ダークモード
---

このブログには元々ダークモードがありませんでした。[はてなブログから独自のシステムに移行した2019年](https://blog.kubosho.com/entries/migrating-from-contentful-to-markdown-file)は、Android 10やiOS 13でダークモードへの切り替えがリリースされて、ようやくダークモードが一般層にも広がる素地ができた年でした。

このブログにも2020年5月の段階でダークモードを導入したいと[issue](https://github.com/kubosho/blog.kubosho.com/issues/298)は作っていました。そこから構想5年を経て、重い腰を上げダークモードを実装しました。嘘です。ずっと構想していたわけではありません。

今回の実装で考慮した点や、今後の課題についてまとめます。

## モードの切り替え実装

今回は `data-theme` 属性をhtml要素に付与し、CSSでライトモードとダークモードのスタイルを定義する方法を採用しました。

```css
/* 実装サンプル */
[data-theme='light'] {
  --color-neutral-background: oklch(0.97 0 0);
  --color-neutral-text: oklch(0.21 0 0);
}

[data-theme='dark'] {
  --color-neutral-background: oklch(0.28 0 0);
  --color-neutral-text: oklch(0.97 0 0);
}
```

読者がブログのテーマを選べるようにしたかったため、`data-theme` 属性でモードを切り替える実装を採用しました。OSの設定に従う「システム」と、明示的な「ライト」「ダーク」の計3つから表示モードを選択できます。

---

テーマを切り替えるUIではPopover APIを使っています。

```html
<button type="button" popovertarget="theme-popover">
  <!-- アイコン -->
</button>

<div id="theme-popover" popover>
  <button data-theme-value="system">システム</button>
  <button data-theme-value="light">ライト</button>
  <button data-theme-value="dark">ダーク</button>
</div>
```

Popover APIはJavaScriptを使わなくともポップオーバーの表示・非表示を切り替えられます。他とえば前述のコードだと `popover="auto"` を指定した状態になり、ポップオーバー領域の外側やEscキーを押すことでポップオーバーを非表示にできます。

またポップオーバーの位置決めにCSS Anchor Positioningを使っています。Baseline 2026なのでようやく主要ブラウザーの安定版で動作するようになった機能です。

```css
.TriggerButton {
  anchor-name: --theme-trigger;
}

.Popover {
  position-anchor: --theme-trigger;
  top: anchor(bottom);
  left: anchor(left);
}
```

ポップオーバーの位置は今までJavaScriptで位置計算をして実装するしかなかったですが、Anchor Positioningが出てきたことでCSSだけを使ってポップオーバーの配置を決められるようになったのは便利だと感じました。[dialog要素](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Elements/dialog)が登場した時と同じ感覚です。

---

モードの設定はCookieに保存しています。ページ読み込み時にCookieからテーマを読み取り、html要素の `data-theme` 属性に反映しています。

```html
<html lang="ja" data-theme="system">
  <script>
    (() => {
      const match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
      const theme = match ? match[1] : 'system';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <!-- ... -->
</html>
```

## OKLCH色空間の採用

色の定義にはOKLCHを採用しました。従来のHEX値やHSLではなく、OKLCHを選んだ理由は知覚的な均一性を得られるためです。

OKLCHの色空間を使うことで、色を比較したときに一方の色が沈んで見えたり、色が違って見えるといった問題が起きにくくなります。[OKLCH Color Picker & Converter](https://oklch.com/)といった直感的な色調整ツールがあるのも良いです。

ただ、色の選定には想定以上に時間がかかりました。ライトモードの色をそのまま反転させても違和感のある配色になります。結局、ライトモードとダークモードの両方とも一から色を選び直しました。

## コントラストの調整

コントラストの基準はWCAG 3で採用予定の[APCA](https://gihyo.jp/article/2023/08/apca-02)を満たすようにしました。測定には[APCA Contrast Calculator](https://apcacontrast.com/)を使いました。

今回の調整で一番苦労したのはメインの色です。今までは `#003760` ——OKLCHでは `oklch(0.329 0.0888 248.18)` を使っていましたが、ダークモードの背景 `oklch(0.28 0 0)` と合わせたときにコントラストがLc 0となってしまうため色を変えなくてはいけませんでした。

個人的には深みのある青色の象徴として `#003760` という値を暗唱できるくらいには気に入っていましたが、コントラストの関係で色を調整せざるを得なくなり、ライトモードでは `oklch(0.43 0.119 253)` を使い、ダークモードでは `oklch(0.51 0.141 253)` を使うようにしました。とはいえ、新しい色もすでに慣れました。

## まとめ

ダークモード対応は思った以上に奥が深いものでした。結果的に配色を一から考え直すことになりました。その分、個人的には気にいった見た目になりました。もしダークモードを使っている人がいれば、見え方のフィードバックをもらえると嬉しいです。

## 参考リンク

- [Popover API](https://developer.mozilla.org/ja/docs/Web/API/Popover_API)
- [HTML popover グローバル属性 - HTML | MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Global_attributes/popover)
- [CSS アンカー位置指定 - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Anchor_positioning)
- [Anchor Positioningが全対応。HTML・CSSだけのポップオーバーが完全体に](https://zenn.dev/ubie_dev/articles/anchor-positioning-popover)
- [oklch() - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Values/color_value/oklch)
- [OKLCH Color Picker & Converter](https://oklch.com/#0.7,0.1,61,100)
- [Charcoal 2.0: デザインシステムの基盤を再構築 - Speaker Deck](https://speakerdeck.com/godlingkogami/charcoal-2-dot-0-tesainsisutemunoji-pan-wozai-gou-zhu)
- [第2回　WCAG3のコントラスト基準APCAの考え方と実例 | gihyo.jp](https://gihyo.jp/article/2023/08/apca-02)
- [APCA in a Nutshell | APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)
