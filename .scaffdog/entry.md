---
name: 'entry'
root: '.'
output: 'entries/2021'
ignore: []
questions:
  name: 'ファイル名を入力してください'
  title: 'タイトルを入力してください'
  categories:
    message: 'カテゴリーを選択してください'
    choices: ['技術', '日記', 'レビュー']
  tags: 'タグを入力してください'
---

# `{{ inputs.name }}.md`

```markdown
---
title: {{ inputs.title }}
created_at: {{ 'new Date().toLocaleString()' | eval }}
categories: {{ inputs.categories }}
tags: {{ inputs.tags }}
---
```
