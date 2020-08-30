---
title: WindowsでもmacOSのようなキー操作を実現する
created_at: 2020-08-30
categories: 日記
tags: Windows, AutoHotkey
---

前から macOS のように Windows でも Ctrl キーを使ったカーソル移動をおこないたいと思っていました。
また macOS のショートカットは Command キーを使うことが多いため、Windows でも各種ショートカットに Windows キーを使うようにしたいと思っていました。

今回これらを実現するべく、レジストリエディターと[AutoHotkey](https://www.autohotkey.com/)を使って、キーボードショートカットを望む形にしました。

## レジストリエディターを使って、左の Windows キーを F13 キーに変更する

[Push To Talk Fix \- Remapping keys to F13](http://www.grismar.net/ventrilocapsfix/)内にある「Remap Left Windows Key to F13」を適用します。
次のレジストリ情報を任意の場所に `.reg` 形式で保存して実行したあと、PC を再起動すれば左の Windows キーが F13 キーに変わります。

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,64,00,5b,e0,00,00,00,00
```

## AutoHotkey を使ってキーボードショートカットを実装する

キーボードショートカットの設定は次の通りになりました。

<script src="https://gist.github.com/kubosho/302cd286eefd8d593ba7861c898b850a.js"></script>

先ほど左の Windows キーをリマップして作り出した F13 キーをふんだんに使って、Windows の Control キーを使ったキーボードショートカットを F13 キーを使うように変更しています。
Control キーについては Emacs っぽくカーソル移動のショートカットに割り当てています。
Windows Terminal を使っているときはショートカットを無効化したかったため、[\[AutoHotKey\]\#IfWinActive で対象ウインドウを指定する \| Output 0\.1](https://pouhon.net/ahk-win-active/2812/)を参考にしてショートカットを無効化しています。

## まとめ

Windows をメインで使い始めてだいぶ経ちますが、ようやく思い通りの操作ができるようになって嬉しいです。
