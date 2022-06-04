import { expect, test } from 'vitest';

import { createGAOptout } from '../ga_optout';

const MOCK_GA_ID = 'mock-ga-id' as const;

test('createGAOptout: Opt-out is activated.', () => {
  const storage = createGAOptout(MOCK_GA_ID);

  storage.enable();

  const actual = storage.enabled();
  expect(actual).toBeTruthy();
});

test('createGAOptout: Opt-out is deactivated.', () => {
  const storage = createGAOptout(MOCK_GA_ID);

  storage.disable();

  const actual = storage.enabled();
  expect(actual).toBeFalsy();
});

test('createGAOptout: Opt-out is activated when process.env.NEXT_PUBLIC_VERCEL_ENV is "preview".', () => {
  const storage = createGAOptout(MOCK_GA_ID);

  process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview';

  const actual = storage.enabled();
  expect(actual).toBeTruthy();
});

test('createGAOptout: Opt-out is activated when process.env.NEXT_PUBLIC_VERCEL_ENV is "development".', () => {
  const storage = createGAOptout(MOCK_GA_ID);

  process.env.NEXT_PUBLIC_VERCEL_ENV = 'development';

  const actual = storage.enabled();
  expect(actual).toBeTruthy();
});
