import entries from '../../data/entries.json';
import { EntryValue } from './entryValue';

export function getEntryList(): Array<EntryValue> {
  const entryList = Object.entries(entries).map(([_id, value]) => value);
  return entryList;
}

export function getEntryIdList(): Array<string> {
  const entryIdList = Object.entries(entries).map(([id]) => id);
  return entryIdList;
}

export function getEntry(id: string): EntryValue {
  return entries[id];
}
