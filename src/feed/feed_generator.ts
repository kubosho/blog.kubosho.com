import { EntryValue } from '../entry/entry_value';
import { SITE_URL } from '../../constants/site_data';
import { activateI18n, retrieveTranslation, setLocale } from '../locales/i18n';

import { createXmlString } from './feed_string_creator';
import { createFeedValue } from './feed_value';

export function generateFeed(entryValues: EntryValue[]): string {
  activateI18n();
  setLocale('ja');

  const feedValue = createFeedValue(entryValues, {
    title: retrieveTranslation('website.title'),
    baseUrl: SITE_URL,
  });

  return createXmlString(feedValue, SITE_URL);
}
