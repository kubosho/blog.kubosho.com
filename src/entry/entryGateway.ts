import path from 'path';
import { getMarkdownFileNameList, mapEntryValue, readMarkdownFileData } from './entryConverter';
import { EntryValue } from './entryValue';

const ENTRY_LIST_DIR = path.resolve('./entries');

export async function fetchEntries(): Promise<EntryValue[]> {
  const markdownFileList = await getMarkdownFileNameList(ENTRY_LIST_DIR);
  const entryDataList = await Promise.all(markdownFileList.map((file) => readMarkdownFileData(file)));
  const entryValueList = await Promise.all(entryDataList.map(mapEntryValue));

  return entryValueList.sort((e1, e2) => e2.createdAt - e1.createdAt).map((entryValue) => ({ ...entryValue }));
}

export async function fetchEntriesByTag(tag: string): Promise<Array<EntryValue>> {
  const entryValueList = await fetchEntries();
  return entryValueList.filter((entry) => entry.tags.find((t) => t === tag));
}

export async function fetchEntriesByCategory(category: string): Promise<Array<EntryValue>> {
  const entryValueList = await fetchEntries();
  return entryValueList.filter((entry) => entry.tags.find((t) => t === category));
}

export async function fetchEntry(id: string): Promise<EntryValue> {
  const entryValueList = await fetchEntries();
  return entryValueList.find((entry) => entry.id === id);
}
