---
title: WSL上のChromiumでPDF出力をする
created_at: 2018-08-05
tags: Headless Chrome, Windows Subsystem for Linux, Ubuntu
---

Windows Subsystem for Linux(WSL)上で Headless Chrome を使って、PDF 出力をしてみました。
やり方としては次に示すコマンドを実行すれば、C ドライブ上の Temp フォルダの中に Google をスクリーンショットした `output.pdf` が出力されます。

```shell
sudo apt install chromium-browser
chromium-browser --headless --disable-gpu --print-to-pdf=/mnt/c/Temp/output.pdf https://www.google.com
```
