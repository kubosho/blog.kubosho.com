import { EntryValueParameter } from '../../entry/entry_value';

export const mockEntryValueParameter: EntryValueParameter = {
  body: '<p>2019 年は丸 1 年ブログの記事を書かず、2018 年も長い記事を書いていなかった。</p>',
  excerpt: '2019 年は丸 1 年ブログの記事を書かず、2018 年も長い記事を書いていなかった。\n',
  id: 'content-of-article-can-not-think-of-anything-syndrome',
  slug: 'content-of-article-can-not-think-of-anything-syndrome',
  title: '記事の内容が思いつかない症候群',
  categories: ['日記'],
  tags: ['考え事'],
  heroImage: undefined,
  createdAt: new Date('2020-05-25').toISOString(),
  updatedAt: new Date('2020-05-25').toISOString(),
  publishedAt: new Date('2020-05-25').toISOString(),
  revisedAt: new Date('2020-05-25').toISOString(),
};
