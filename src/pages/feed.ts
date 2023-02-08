import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { generateFeed } from '../feed/feed_generator';
import { getEntryList } from '../entry/entry_gateway';

dayjs.extend(utc);
const BUILD_TIME = dayjs().utc().toISOString();

export const get = async (): Promise<Response> => {
  const entries = await getEntryList();
  const body = generateFeed(entries, BUILD_TIME);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
