import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

import { convertMarkdownToPlainText } from './entry_converter';

export async function getSortedEntries(): Promise<CollectionEntry<'entries'>[]> {
  const entries = await getCollection('entries');
  const modifiedEntries = await Promise.all(
    entries.map(async (entry) => {
      const excerpt =
        entry.data.excerpt ?? (await convertMarkdownToPlainText(entry.body.split('\n').filter((b) => b !== '')[0]));

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
