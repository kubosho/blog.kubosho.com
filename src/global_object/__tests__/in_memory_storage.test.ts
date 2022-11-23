import { expect, test } from 'vitest';

import { InMemoryStorage } from '../in_memory_storage';

const MOCK_KEY = 'mock-storage-key' as const;
const MOCK_DATA = 'mock-data' as const;

test('InMemoryStorage: Set items can be retrieved.', () => {
  const storage = new InMemoryStorage();

  storage.setItem(MOCK_KEY, MOCK_DATA);

  const actual = storage.getItem(MOCK_KEY);
  expect(actual).toBe(MOCK_DATA);
});

test('InMemoryStorage: The set item has been deleted.', () => {
  const storage = new InMemoryStorage();

  storage.setItem(MOCK_KEY, MOCK_DATA);
  storage.removeItem(MOCK_KEY);

  const actual = storage.getItem(MOCK_KEY);
  expect(actual).toBe(null);
});

test('InMemoryStorage: All items has been deleted.', () => {
  const storage = new InMemoryStorage();

  storage.setItem(MOCK_KEY, MOCK_DATA);
  storage.clear();

  const actual = storage.getItem(MOCK_KEY);
  expect(actual).toBe(null);
});
