import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { SITE_URL } from '../../constants/site_data';
import { activateI18n, retrieveTranslation, setLocale } from '../locales/i18n';
import { generateFeed } from '../feed/feed_generator';
import { getEntryList } from '../entry/entry_gateway';

dayjs.extend(utc);
const BUILD_TIME = dayjs().utc().toISOString();

export const get = async (): Promise<Response> => {
  activateI18n();
  setLocale('ja');

  const entries = await getEntryList();
  const metadata = {
    title: retrieveTranslation('website.title'),
    baseUrl: SITE_URL,
    buildTime: BUILD_TIME,
  };
  const body = generateFeed(entries, metadata);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
