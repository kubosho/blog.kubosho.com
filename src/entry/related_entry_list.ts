import { EntryValue } from './entry_value';

const MAX_ENTRY_COUNT = 3;

export function getRelatedEntryList(
  entryId: string,
  entryListByCategory: EntryValue[],
  entryListByTag: EntryValue[],
): EntryValue[] {
  const entries = [...entryListByTag, ...entryListByCategory];
  const filteredEntries = Array.from(
    new Map(entries.filter((entry) => entryId !== entry.slug).map((entry) => [entry.slug, entry])).values(),
  );

  return filteredEntries.slice(0, MAX_ENTRY_COUNT);
}
