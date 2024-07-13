import { expect, test } from 'vitest';

import { createGAOptoutStorage } from '../ga_optout_storage';

const MOCK_GA_ID = 'mock-ga-id' as const;

test('createGAOptoutStorage: Set items can be retrieved.', () => {
  const storage = createGAOptoutStorage();

  storage.saveId(MOCK_GA_ID);

  const actual = storage.getId();
  expect(actual).toBe(MOCK_GA_ID);
});

test('createGAOptoutStorage: The set item has been deleted.', () => {
  const storage = createGAOptoutStorage();

  storage.saveId(MOCK_GA_ID);
  storage.deleteId();

  const actual = storage.getId();
  expect(actual).toBe(null);
});
