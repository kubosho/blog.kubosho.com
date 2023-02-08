import { generateFeed } from '../feed/feed_generator';
import { getEntryList } from '../entry/entry_gateway';

export const get = async (): Promise<Response> => {
  const entries = await getEntryList();
  const body = generateFeed(entries);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
