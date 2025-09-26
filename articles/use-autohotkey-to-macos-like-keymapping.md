---
title: WindowsでもmacOSのようなキー操作を実現する
excerpt: 前から macOS のように Windows でも Ctrl キーを使ったカーソル移動をおこないたいと思っていました。
categories: [技術]
tags: [Windows, AutoHotKey]
publishedAt: 2020-08-30T00:00:00.000Z
revisedAt: 2022-11-28T14:56:53.256Z
---

前からmacOSのようにWindowsでもCtrlキーを使ったカーソル移動をおこないたいと思っていました。\
またmacOSのショートカットはCommandキーを使うことが多いため、Windowsでも各種ショートカットにWindowsキーを使うようにしたいと思っていました。

今回これらを実現するべく、レジストリエディターと[AutoHotkey](https://www.autohotkey.com/)を使って、キーボードショートカットを望む形にしました。

## レジストリエディターを使って、左の Windows キーを F13 キーに変更する

[Push To Talk Fix - Remapping keys to F13](http://www.grismar.net/ventrilocapsfix/)内にある「Remap Left Windows Key to F13」を適用します。\
次のレジストリ情報を任意の場所に `.reg` 形式で保存して実行したあと、PCを再起動すれば左のWindowsキーがF13キーに変わります。

    Windows Registry Editor Version 5.00

    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
    "Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,64,00,5b,e0,00,00,00,00

## AutoHotkey を使ってキーボードショートカットを実装する

キーボードショートカットの設定は次の通りになりました。

```ahk
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#UseHook, On
#SingleInstance, force
; F13 & Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; macOS like keymap
F13 & /::^/
F13 & ,::^,
F13 & 1::^1
F13 & 2::^2
F13 & 3::^3
F13 & 4::^4
F13 & 5::^5
F13 & 6::^6
F13 & 7::^7
F13 & 8::^8
F13 & 9::^9
F13 & 0::^0
F13 & a::^a
F13 & b::^b
F13 & c::^c
F13 & f::^f
F13 & h::^h
F13 & i::^i
F13 & k::^k
F13 & l::^l
F13 & n::^n
F13 & p::^p
F13 & q::!F4
F13 & r::^r
F13 & s::^s
F13 & t::^t
F13 & v::^v
F13 & w::^w
F13 & x::^x
F13 & z::^z
F13 & Enter::^Enter
F13 & Space::#s
; https://superuser.com/questions/1246946/autohotkey-remapping-altshifttab-to-lwinshifttab
F13 & Tab::
    AltTabMenu := true
    If GetKeyState("Shift","P")
        Send {Alt Down}{Shift Down}{Tab}
    else
        Send {Alt Down}{Tab}
return

#If (AltTabMenu)
    ~*F13 Up::
        Send {Shift Up}{Alt Up}
        AltTabMenu := false
    return
#If

; Windows keymap
F13 & e::#e
F13 & Up::#Up
F13 & Right::#Right
F13 & Down::#Down
F13 & Left::#Left
#IfWinNotActive, ahk_exe WindowsTerminal.exe
Return
#IfWinNotActive

; Emacs like keymap
#IfWinNotActive, ahk_exe WindowsTerminal.exe
^p::Send,  {Up}
^f::Send,  {Right}
^n::Send,  {Down}
^b::Send,  {Left}
^+p::Send, {Shift}+{Up}
^+f::Send, {Shift}+{Right}
^+n::Send, {Shift}+{Down}
^+b::Send, {Shift}+{Left}
^a::Send,  {Home}
^e::Send,  {End}
^d::Send,  {Delete}
^h::Send,  {BackSpace}
^m::Send,  {Enter}
^k::Send,  {Shift}+{End}{BackSpace}
Return
#IfWinNotActive
```

先ほど左のWindowsキーをリマップして作り出したF13キーをふんだんに使って、WindowsのControlキーを使ったキーボードショートカットをF13キーを使うように変更しています。\
ControlキーについてはEmacsっぽくカーソル移動のショートカットに割り当てています。\
Windows Terminalを使っているときはショートカットを無効化したかったため、[\[AutoHotKey\]#IfWinActive で対象ウインドウを指定する | Output 0.1](https://pouhon.net/ahk-win-active/2812/)を参考にしてショートカットを無効化しています。

## まとめ

Windowsをメインで使い始めてだいぶ経ちますが、ようやく思い通りの操作ができるようになって嬉しいです。
