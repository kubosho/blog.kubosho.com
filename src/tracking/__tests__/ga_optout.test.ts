import { expect, test } from 'vitest';

import { createGAOptout } from '../ga_optout';

const MOCK_GA_ID = 'mock-ga-id' as const;

test('createGAOptout: Opt-out is activated.', () => {
  const optout = createGAOptout(MOCK_GA_ID);

  optout.enable();

  const actual = optout.enabled();
  expect(actual).toBe(true);
});

test('createGAOptout: Opt-out is deactivated.', () => {
  const optout = createGAOptout(MOCK_GA_ID);

  optout.disable();

  const actual = optout.enabled();
  expect(actual).toBe(false);
});
