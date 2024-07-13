import rosetta from 'rosetta';
import type { Rosetta } from 'rosetta';

import { localeJa } from './ja';

const i18n: Rosetta<unknown> = rosetta({ ja: { ...localeJa } });
i18n.locale('ja');

export function retrieveTranslation(
  key: string | (string | number)[],
  params?: unknown[] | Record<string, unknown>,
  lang?: string,
): string {
  if (i18n === null) {
    throw new Error('i18n is not activated');
  }

  const r = i18n.t(key, params, lang);

  if (r === '') {
    throw new Error(`Translate text is not retrieved: ${key}`);
  }

  return r;
}
