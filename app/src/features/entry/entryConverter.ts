import type { Root, RootContent } from 'mdast';
import breaks from 'remark-breaks';
import gfm from 'remark-gfm';
import html from 'remark-html';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import strip from 'strip-markdown';
import { unified } from 'unified';

const markdownProcessor = unified().use(parse).use(gfm);

// This runs before converting mdast -> hast -> HTML (remark-html),
// so ids end up as attributes on the resulting <h1..h6> elements.
function headingIdPlugin() {
  return (tree: Root): void => {
    const slugCounts = new Map<string, number>();

    const toText = (node: RootContent | Root): string => {
      switch (node.type) {
        case 'text': {
          return node.value;
        }
        case 'inlineCode': {
          return node.value;
        }
        default: {
          if ('children' in node) {
            return node.children.map((child) => toText(child)).join('');
          }
          return '';
        }
      }
    };

    const slugify = (text: string): string => {
      const base = text
        .trim()
        .toLowerCase()
        // Remove punctuation except spaces, hyphens and underscores.
        // Keep unicode letters/numbers.
        .replace(/[^\p{Letter}\p{Number}\s\-_]/gu, '')
        .replace(/\s+/g, '-');

      const n = slugCounts.get(base) ?? 0;
      slugCounts.set(base, n + 1);
      return n > 0 ? `${base}-${n}` : base;
    };

    const visit = (node: RootContent | Root): void => {
      if (node.type === 'heading') {
        const heading = node;
        const text = heading.children.map((child) => toText(child)).join('');
        const id = slugify(text);

        heading.data = heading.data ?? {};
        heading.data.hProperties = {
          ...(heading.data.hProperties ?? {}),
          id,
        };
      }

      if ('children' in node) {
        node.children.forEach((child) => visit(child));
      }
    };

    visit(tree);
  };
}

export async function convertMarkdownToHtml(markdownText: string): Promise<string> {
  const processor = markdownProcessor().use(breaks).use(headingIdPlugin).use(html, { sanitize: false });
  return (await processor.process(markdownText)).value.toString();
}

export async function convertMarkdownToPlainText(markdownText: string): Promise<string> {
  const processor = markdownProcessor().use(strip).use(stringify);
  return (await processor.process(markdownText)).value.toString();
}
