import { writeFile } from 'fs/promises';

import { EntryValue } from '../entry/entry_value';
import { generateFeed } from './feed_generator';

const BASE_DIR = process.cwd();
const DIST_DIR = 'public';
const OUTPUT_FILE_NAME = 'feed.xml';
const DESTINATION_FILE = `${BASE_DIR}/${DIST_DIR}/${OUTPUT_FILE_NAME}`;

export async function writeFeedFile(entryValues: EntryValue[]): Promise<void> {
  const feedString = generateFeed(entryValues);
  await writeFile(DESTINATION_FILE, feedString);
}
