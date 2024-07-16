import rehypePrism from '@mapbox/rehype-prism';
import html from 'rehype-stringify';
import breaks from 'remark-breaks';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import stringify from 'remark-stringify';
import strip from 'strip-markdown';
import { unified } from 'unified';

const markdownProcessor = unified().use(markdown).use(gfm);

export async function convertMarkdownToHtml(markdownText: string): Promise<string> {
  const processor = markdownProcessor()
    .use(breaks)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypePrism, { ignoreMissing: true })
    .use(html, { allowDangerousHtml: true });

  return (await processor.process(markdownText)).value.toString();
}

export async function convertMarkdownToPlainText(markdownText: string): Promise<string> {
  const processor = markdownProcessor().use(strip).use(stringify);

  return (await processor.process(markdownText)).value.toString();
}