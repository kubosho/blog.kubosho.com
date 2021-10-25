import { EntryValue } from './entryValue';

const MAX_ENTRY_COUNT = 5;

export async function getRelatedEntryList(
  entryId: string,
  entryListByCategory: EntryValue[],
  entryListByTag: EntryValue[],
): Promise<{ id: string; title: string }[]> {
  const entryList = [...entryListByTag, ...entryListByCategory];
  const filteredEntryList = Array.from(
    new Map(entryList.filter((entry) => entryId !== entry.slug).map((entry) => [entry.slug, entry])).values(),
  );

  return filteredEntryList.slice(0, MAX_ENTRY_COUNT).map((entry) => {
    return {
      id: entry.slug,
      title: entry.title,
    };
  });
}
