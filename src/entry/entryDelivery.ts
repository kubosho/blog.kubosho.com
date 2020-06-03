import entries from '../../data/entries.json';
import { EntryValue } from './entryValue';

export function getEntryList(): Array<EntryValue> {
  const entryList = Object.entries(entries).map(([_id, value]) => value);
  return entryList;
}

export function getEntry(id: string): EntryValue {
  return entries[id];
}
