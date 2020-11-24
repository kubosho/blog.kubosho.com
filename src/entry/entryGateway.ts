import path from 'path';
import { getMarkdownFileNameList, mapEntryValue, readMarkdownFileData } from './entryConverter';
import { EntryValue } from './entryValue';

const ENTRY_LIST_DIR = path.resolve('./entries');

export async function getEntryList(): Promise<EntryValue[]> {
  const markdownFileList = await getMarkdownFileNameList(ENTRY_LIST_DIR);
  const entryDataList = await Promise.all(markdownFileList.map((file) => readMarkdownFileData(file)));
  const entryValueList = await Promise.all(entryDataList.map(mapEntryValue));

  return entryValueList.sort((e1, e2) => e2.createdAt - e1.createdAt).map((entryValue) => ({ ...entryValue }));
}

export async function getEntryListByTag(tag: string): Promise<Array<EntryValue>> {
  const entryValueList = await getEntryList();
  return entryValueList.filter((entry) => entry.tags.find((t) => t === tag));
}

export async function getEntryListByCategory(category: string): Promise<Array<EntryValue>> {
  const entryValueList = await getEntryList();
  return entryValueList.filter((entry) => entry.tags.find((t) => t === category));
}

export async function getEntry(id: string): Promise<EntryValue> {
  const entryValueList = await getEntryList();
  return entryValueList.find((entry) => entry.id === id);
}

export async function getEntryIdList(): Promise<string[]> {
  const entryValueList = await getEntryList();
  return entryValueList.map((entryValue) => entryValue.id);
}
