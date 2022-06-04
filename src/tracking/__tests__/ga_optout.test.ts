import { expect, test } from 'vitest';

import { createGAOptout } from '../ga_optout';

const MOCK_GA_ID = 'mock-ga-id' as const;

test('createGAOptout: Opt-out is activated.', () => {
  const storage = createGAOptout(MOCK_GA_ID);

  storage.enable();

  const actual = storage.enabled();
  expect(actual).toBeTruthy();
});

test('createGAOptout: Opt-out is disabled.', () => {
  const storage = createGAOptout(MOCK_GA_ID);

  storage.disable();

  const actual = storage.enabled();
  expect(actual).toBeFalsy();
});
