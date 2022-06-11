import { expect, test } from 'vitest';
import { activateI18n, retrieveTranslation, setLocale } from '../i18n';

test('i18n', () => {
  activateI18n();
  setLocale('ja');

  const actual = retrieveTranslation('website.title');

  expect(actual).toBe('学ぶ、考える、書き出す。');
});
