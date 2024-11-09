import type { TinyCollectionEntry } from './tiny_collection_entry';

export function getSortedEntries(entries: TinyCollectionEntry[]): TinyCollectionEntry[] {
  return entries.toSorted((a, b) => (a.data.publishedAt < b.data.publishedAt ? 1 : -1));
}
