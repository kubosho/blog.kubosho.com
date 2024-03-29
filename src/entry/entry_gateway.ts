import { fetchEntries } from '../microcms_api/data_fetcher';

import type { EntryValue } from './entry_value';

let entries: EntryValue[] | null = null;

export async function getEntryList(): Promise<EntryValue[]> {
  if (!entries) {
    entries = await fetchEntries();
  }
  return entries.sort((e1, e2) => e2.publishedAt - e1.publishedAt).map((entryValue) => ({ ...entryValue }));
}

export async function getEntryListByTag(tag: string): Promise<Array<EntryValue>> {
  const entryValueList = await getEntryList();
  return entryValueList.filter((entry) => entry.tags?.find((t) => t === tag));
}

export async function getEntryListByCategory(category: string): Promise<Array<EntryValue>> {
  const entryValueList = await getEntryList();
  return entryValueList.filter((entry) => entry.categories?.find((t) => t === category));
}

export async function getEntry(id: string): Promise<EntryValue | null> {
  const entryValueList = await getEntryList();
  return entryValueList.find((entry) => entry.slug === id) ?? null;
}

export async function getEntryIdList(): Promise<string[]> {
  const entryValueList = await getEntryList();
  return entryValueList.map((entryValue) => entryValue.id);
}

export async function getEntrySlugList(): Promise<string[]> {
  const entryValueList = await getEntryList();
  return entryValueList.map((entryValue) => entryValue.slug);
}

export async function getCategoryIdList(): Promise<string[]> {
  const entryValueList = await getEntryList();
  return entryValueList.map((entryValue) => (entryValue.categories ?? []).map((category) => category)).flat();
}

export async function getTagIdList(): Promise<string[]> {
  const entryValueList = await getEntryList();
  return entryValueList.map((entryValue) => (entryValue.tags ?? []).map((tag) => tag)).flat();
}
