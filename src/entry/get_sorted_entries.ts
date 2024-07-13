import type { CollectionEntry } from 'astro:content';
// This next line the lint error is false positive
// eslint-disable-next-line import/no-unresolved
import { getCollection } from 'astro:content';

import { convertMarkdownToPlainText } from './entry_converter';

function extractFirstNonEmptyLine(body: string): string {
  return (
    body
      .split('\n')
      .filter((b) => b !== '')
      .at(0) ?? ''
  );
}

export async function getSortedEntries(): Promise<CollectionEntry<'entries'>[]> {
  const entries = await getCollection('entries');
  const modifiedEntries = await Promise.all(
    entries.map(async (entry) => {
      const excerpt = entry.data.excerpt ?? (await convertMarkdownToPlainText(extractFirstNonEmptyLine(entry.body)));

      return {
        ...entry,
        data: {
          ...entry.data,
          excerpt,
        },
      };
    }),
  );
  const sortedEntries = modifiedEntries.toSorted((a, b) => (a.data.publishedAt < b.data.publishedAt ? 1 : -1));

  return sortedEntries;
}
