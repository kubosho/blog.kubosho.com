import entries from '../../data/entries.json';
import { EntryValue } from './entryValue';

export function getEntryList(): Array<EntryValue> {
  return entries;
}

export function getEntry(id: string): EntryValue {
  return entries.filter((entry) => entry.id === id).shift();
}
