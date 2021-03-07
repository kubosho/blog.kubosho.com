import { EntryValue } from './entryValue';

const MAX_ENTRY_COUNT = 5;

export async function getRelatedEntryList(
  entryId: string,
  entryListByCategory: EntryValue[],
  entryListByTag: EntryValue[],
): Promise<{ id: string; title: string }[]> {
  const entryList = [...entryListByTag, ...entryListByCategory];
  const entryListWithRemovedDuplicateEntry = [...new Map(entryList.map((entry) => [entry.id, entry])).values()];
  const filteredEntryList = entryListWithRemovedDuplicateEntry.filter((entry) => entryId !== entry.id);

  return filteredEntryList.slice(0, MAX_ENTRY_COUNT).map((entry) => {
    return {
      id: entry.id,
      title: entry.title,
    };
  });
}
