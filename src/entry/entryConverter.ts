import unified from 'unified';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import breaks from 'remark-breaks';
import strip from 'strip-markdown';
import remarkToRehype from 'remark-rehype';
import html from 'rehype-stringify';
import lazyLoadPlugin from 'rehype-plugin-image-native-lazy-loading';
import resolveLayoutShiftPlugin from 'rehype-plugin-auto-resolve-layout-shift';
import rehypePrism from '@mapbox/rehype-prism';

import { EntryValue, EntryValueParameter } from './entryValue';

export async function mapEntryValue(contents: EntryValueParameter): Promise<EntryValue> {
  const { title, body: originalBody, excerpt: originalExcerpt, categories, tags } = contents;

  const markdownProcessor = (): unified.Processor<unified.Settings> => unified().use(markdown).use(gfm);
  const contentsProcessor = markdownProcessor()
    .use(breaks)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(lazyLoadPlugin)
    .use(resolveLayoutShiftPlugin, { type: 'maxWidth', maxWidth: 800 })
    .use(rehypePrism, { ignoreMissing: true })
    .use(html, { allowDangerousHtml: true });
  const excerptProcessor = markdownProcessor().use(strip).use(stringify);

  const body = await contentsProcessor.process(originalBody);
  const excerpt = await excerptProcessor.process({ contents: originalBody.split('\n')[0].replace(/\\$/, '') });

  const categoryList = categories?.map((category) => category.trim()) ?? [];
  const tagList = tags?.map((tag) => tag.trim()) ?? [];

  return new EntryValue({
    ...contents,
    title,
    body: body.contents.toString(),
    excerpt: originalExcerpt ?? excerpt.contents.toString().trim(),
    categories: categoryList,
    tags: tagList,
  });
}
