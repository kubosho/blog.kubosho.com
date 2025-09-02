import { convertMarkdownToPlainText } from './entryConverter';
import type { TinyCollectionEntry } from './tinyCollectionEntry';

function extractFirstNonEmptyLine(body: string): string {
  return (
    body
      .split('\n')
      .filter((b) => b !== '')
      .at(0) ?? ''
  );
}

export async function addExcerptToEntries(entries: TinyCollectionEntry[]): Promise<TinyCollectionEntry[]> {
  return await Promise.all(
    entries.map(async (entry) => {
      const hasExcerpt = entry.data.excerpt != null;
      if (hasExcerpt) {
        return entry;
      }

      const excerpt = (await convertMarkdownToPlainText(extractFirstNonEmptyLine(entry.body))).trim();

      return {
        ...entry,
        data: {
          ...entry.data,
          excerpt,
        },
      };
    }),
  );
}
