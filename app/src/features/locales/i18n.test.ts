import { expect, test } from 'vitest';

import { retrieveTranslation } from './i18n';

test('i18n', () => {
  const actual = retrieveTranslation('website.title');

  expect(actual).toBe('学ぶ、考える、書き出す。');
});
