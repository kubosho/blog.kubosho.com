---
title: Claude CodeのSkillsでWeb機能のBaseline対応状況を確認できるようにした
categories: [技術]
tags: [Claude Code, Baseline, Web Platform, 作ってみた]
publishedAt: 2026-03-02T00:00:00.000Z
---

Claude Codeで使える[Skills](https://code.claude.com/docs/ja/skills)の仕組みを使って、[Web Platform Baseline](https://web.dev/baseline)をClaude Codeから参照できるようにしました。

`XX機能の対応状況はどんな感じ？` と聞くだけで、Baselineの状態やサポートブラウザーのバージョンが出ます。

私の新しいdotfilesリポジトリにスキルが含まれています。以下のリンクからスキルを見られます。

<https://github.com/kubosho/new-dotfiles/blob/a6f65f4/dot_claude/skills/baseline/SKILL.md>

## なぜ作ったのか

開発する中で「この機能のブラウザー対応状況はどんな感じだっけ」と気になった場合、今までは以下の手段で確認していました。

- [Can I use](https://caniuse.com/)を開いて検索する
- [MDN](https://developer.mozilla.org/)の互換性テーブルを確認する

しかし、どちらもブラウザーに切り替えて検索する必要があって、コーディング中の流れが途切れるので嫌でした。

## 技術的な話

Baselineの情報を取得するために[Web Platform Status API](https://api.webstatus.dev/v1/features)へリクエストしています。このAPIは `GET https://api.webstatus.dev/v1/features?q={query}` というエンドポイントで、ある機能のBaseline状態やブラウザーのサポート情報を返します。

リクエスト時に使えるクエリを一部紹介すると、以下のような演算子が使えます。

- `name:grid` のようにキーワードで機能名を検索
- `baseline_status:widely` で広くサポートされている機能を絞り込み
- `available_on:chrome` や `-available_on:firefox` でブラウザーごとのサポート有無でフィルタ

AND条件はスペース区切り、OR条件は `+OR+` という記法を使うことで指定できます。例えば `name:grid baseline_status:widely` で「Widely availableになっているgrid関連の機能」を探せます。

### Skillの構造

今回作成したSkillでは、APIのエンドポイント・演算子の一覧・入出力・制約だけを定義しています。ツールの使用や、機能の詳細情報をどこまで表示するかはAIエージェントに任せています。

出力フォーマットは情報量に応じて変更しています。結果が少なければBaselineの状態・サポート日時・ブラウザーバージョンなどを詳細に表示し、結果が多ければサマリーテーブルに切り替えています。

また、10秒経過後にタイムアウトさせるのと、同時リクエスト数の上限を最大3リクエストにするといった制約も設けています。

## 使ってみて

新しめの機能を使いたいときに「これ大丈夫だっけ」とすぐ聞けて良いです。

特に「主要ブラウザーでまだ使えない機能は？」と自然言語で質問した場合に、AIエージェント側でよしなにクエリを構築して検索できるのが良いです。

あとは最新の状況を知る目的でも使えます。Claude Code上で「2026年にwidelyまたはnewlyへ達した、CSSやJSの機能はある？」という質問した時の応答は以下の通りです。情報は2026年2月26日時点の情報です。

```text
⏺ Skill(baseline)
  ⎿  Successfully loaded skill

⏺ 2026年のbaseline到達状況を調べるね。CSSとJavaScriptそれぞれ、widelyとnewlyで検索する。

⏺ Fetch(https://api.webstatus.dev/v1/features?q=baseline_date:2026-01-01..2026-12-31%20baseline_status:widely%20group:css)
  ⎿  Received 35 bytes (200 OK)

⏺ Fetch(https://api.webstatus.dev/v1/features?q=baseline_date:2026-01-01..2026-12-31%20baseline_status:newly%20group:css)
  ⎿  Received 5.8KB (200 OK)

⏺ Fetch(https://api.webstatus.dev/v1/features?q=baseline_date:2026-01-01..2026-12-31%20baseline_status:widely%20group:javascript)
  ⎿  Received 35 bytes (200 OK)

⏺ Fetch(https://api.webstatus.dev/v1/features?q=baseline_date:2026-01-01..2026-12-31%20baseline_status:newly%20group:javascript)
  ⎿  Received 2KB (200 OK)

⏺ 2026年（現時点まで）にBaseline到達した機能をまとめたよ。

使ったクエリ:
- baseline_date:2026-01-01..2026-12-31 baseline_status:newly group:css
- baseline_date:2026-01-01..2026-12-31 baseline_status:newly group:javascript
- widely は CSS・JS ともに 0件だった

---
CSS — Newly available (5件)

すべて 2026-01-13 に newly 到達。最後のブラウザが Firefox 147。

┌────────────────────────┬───────────────┬────────────────┬──────────────────┐
│        Feature         │    Chrome     │     Safari     │  Firefox (最後)  │
├────────────────────────┼───────────────┼────────────────┼──────────────────┤
│ Active view transition │ 125 (2024-05) │ 18.2 (2024-12) │ 147 (2026-01-13) │
├────────────────────────┼───────────────┼────────────────┼──────────────────┤
│ rcap unit              │ 118 (2023-10) │ 17.2 (2023-12) │ 147 (2026-01-13) │
├────────────────────────┼───────────────┼────────────────┼──────────────────┤
│ rch unit               │ 111 (2023-03) │ 17.2 (2023-12) │ 147 (2026-01-13) │
├────────────────────────┼───────────────┼────────────────┼──────────────────┤
│ rex unit               │ 111 (2023-03) │ 17.2 (2023-12) │ 147 (2026-01-13) │
├────────────────────────┼───────────────┼────────────────┼──────────────────┤
│ ric unit               │ 111 (2023-03) │ 17.2 (2023-12) │ 147 (2026-01-13) │
└────────────────────────┴───────────────┴────────────────┴──────────────────┘

rcap/rch/rex/ric はルートフォントに基づく相対単位。Firefox 147 での実装で全ブラウザ対応になった。

---
JavaScript — Newly available (2件)

┌───────────────────────────────┬────────────┬───────────────┬────────────────┬──────────────────┐
│            Feature            │ Baseline日 │    Chrome     │     Safari     │  Firefox (最後)  │
├───────────────────────────────┼────────────┼───────────────┼────────────────┼──────────────────┤
│ Map.prototype.getOrInsert()   │ 2026-02-14 │ 145 (2026-02) │ 26.2 (2025-12) │ 144 (2025-10)    │
├───────────────────────────────┼────────────┼───────────────┼────────────────┼──────────────────┤
│ JS modules in service workers │ 2026-01-13 │ 91 (2021-05)  │ 15 (2021-09)   │ 147 (2026-01-13) │
└───────────────────────────────┴────────────┴───────────────┴────────────────┴──────────────────┘

Map.prototype.getOrInsert() は TC39 提案の機能で、キーが存在しなければ値を挿入して返す。Chrome 145 が最後の実装で newly に到達。

---
まとめ

- Widely 到達: CSS・JS ともに 0件（2026年はまだ2ヶ月しか経っていないので、これから増える可能性がある）
- Newly 到達: CSS 5件 + JS 2件 = 計7件
- Firefox 147 のリリース（2026-01-13）が多くの機能の baseline 到達トリガーになっている
```
