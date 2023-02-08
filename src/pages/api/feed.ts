import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { NextApiRequest, NextApiResponse } from 'next';

import { SITE_URL } from '../../../constants/site_data';
import { getEntryList } from '../../entry/entry_gateway';
import { generateFeed } from '../../feed/feed_generator';
import { activateI18n, retrieveTranslation, setLocale } from '../../locales/i18n';

dayjs.extend(utc);
const BUILD_TIME = dayjs().utc().toISOString();

export default async function handler(_request: NextApiRequest, response: NextApiResponse): Promise<void> {
  activateI18n();
  setLocale('ja');

  const entries = await getEntryList();
  const metadata = {
    title: retrieveTranslation('website.title'),
    baseUrl: SITE_URL,
    buildTime: BUILD_TIME,
  };
  const responseBody = generateFeed(entries, metadata);

  response.status(200).setHeader('Content-Type', 'application/xml').send(responseBody);
}
