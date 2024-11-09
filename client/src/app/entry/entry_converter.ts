import breaks from 'remark-breaks';
import gfm from 'remark-gfm';
import html from 'remark-html';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import strip from 'strip-markdown';
import { unified } from 'unified';

const markdownProcessor = unified().use(parse).use(gfm);

export async function convertMarkdownToHtml(markdownText: string): Promise<string> {
  const processor = markdownProcessor().use(breaks).use(html, { sanitize: false });

  return (await processor.process(markdownText)).value.toString();
}

export async function convertMarkdownToPlainText(markdownText: string): Promise<string> {
  const processor = markdownProcessor().use(strip).use(stringify);

  return (await processor.process(markdownText)).value.toString();
}
