// This next line the lint error is false positive
// eslint-disable-next-line import/no-unresolved
import { getCollection } from 'astro:content';

import { SITE_URL } from '../../constants/site_data';
import { addExcerptToEntries } from '../features/entry/add_excerpt_to_entries';
import { formatIsoString } from '../features/entry/date';
import { getSortedEntries } from '../features/entry/get_sorted_entries';
import { generateFeed } from '../features/feed/feedGenerator';
import { retrieveTranslation } from '../features/locales/i18n';

const BUILD_TIME = formatIsoString(new Date());

export const GET = async (): Promise<Response> => {
  const entries = await getCollection('entries');
  const modifiedEntries = await addExcerptToEntries(entries);
  const sortedEntries = getSortedEntries(modifiedEntries);
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
};
