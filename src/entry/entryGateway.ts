import { API_V1_URL } from '../constants/api_url';
import { EntryValue } from './entryValue';

export function fetchEntries(): Promise<Array<EntryValue>> {
  return fetch(`${API_V1_URL}/entries`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const entries = (await res.json()) as Array<EntryValue>;
      return entries;
    })
    .catch((error: Error) => {
      throw error;
    });
}

export function fetchEntriesByTag(tag: string): Promise<Array<EntryValue>> {
  return fetch(`${API_V1_URL}/entries`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const entries = (await res.json()) as Array<EntryValue>;
      const filteredEntries = entries.filter((entry) => entry.tags.find((t) => t === tag));

      return filteredEntries;
    })
    .catch((error: Error) => {
      throw error;
    });
}

export function fetchEntriesByCategory(category: string): Promise<Array<EntryValue>> {
  return fetch(`${API_V1_URL}/entries`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const entries = (await res.json()) as Array<EntryValue>;
      const filteredEntries = entries.filter((entry) => entry.categories.find((c) => c === category));

      return filteredEntries;
    })
    .catch((error: Error) => {
      throw error;
    });
}

export function fetchEntry(id: string): Promise<EntryValue> {
  return fetch(`${API_V1_URL}/entries/${id}`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const entry = (await res.json()) as EntryValue;
      return entry;
    })
    .catch((error: Error) => {
      throw error;
    });
}
