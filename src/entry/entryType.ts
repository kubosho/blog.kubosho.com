import { EntryValue } from './entryValue';

export type Entries = ReadonlyArray<EntryValue>;

export type EntriesObject = {
  entries: Entries;
};
