// This next line the lint error is false positive
// eslint-disable-next-line import/no-unresolved
import { getCollection } from 'astro:content';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { SITE_URL } from '../../constants/site_data';
import { getSortedEntries } from '../app/entry/get_sorted_entries';
import { generateFeed } from '../app/feed/feed_generator';
import { retrieveTranslation } from '../app/locales/i18n';

dayjs.extend(utc);
dayjs.extend(timezone);

const BUILD_TIME = dayjs().utc().toISOString();

export async function GET(): Promise<Response> {
  const entries = await getCollection('entries');
  const sortedEntries = getSortedEntries(entries);
  const metadata = {
    title: retrieveTranslation('website.title'),
    description: retrieveTranslation('website.description'),
    baseUrl: SITE_URL,
    buildTime: BUILD_TIME,
  };
  const body = await generateFeed(sortedEntries, metadata);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
