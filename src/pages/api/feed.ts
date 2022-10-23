import type { NextApiRequest, NextApiResponse } from 'next';
import { getEntryList } from '../../entry/entry_gateway';
import { generateFeed } from '../../feed/feed_generator';

export default async function handler(_request: NextApiRequest, response: NextApiResponse): Promise<void> {
  const entries = await getEntryList();
  const responseBody = generateFeed(entries);

  response.status(200).setHeader('Content-Type', 'application/xml').send(responseBody);
}
