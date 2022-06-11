import rosetta, { Rosetta } from 'rosetta';

import { localeJa } from './ja';

export type SupportedLanguage = 'ja';

let i18n: Rosetta<unknown> | null = null;
let currentLanguage: SupportedLanguage | null = null;

export function activateI18n(): void {
  if (i18n !== null) {
    return;
  }

  i18n = rosetta({ ja: { ...localeJa } });
}

export function setLocale(lang: SupportedLanguage): void {
  if (i18n === null) {
    throw new Error('i18n is not activated');
  }

  if (currentLanguage === lang) {
    return;
  }

  currentLanguage = lang;
  i18n.locale(currentLanguage);
}

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
