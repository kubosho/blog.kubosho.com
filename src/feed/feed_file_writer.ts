import { writeFile } from 'fs/promises';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { activateI18n, retrieveTranslation, setLocale } from '../locales/i18n';
import { SITE_URL } from '../../constants/site_data';
import { EntryValue } from '../entry/entry_value';

import { generateFeed } from './feed_generator';

const BASE_DIR = process.cwd();
const DIST_DIR = 'public';
const OUTPUT_FILE_NAME = 'feed.xml';
const DESTINATION_FILE = `${BASE_DIR}/${DIST_DIR}/${OUTPUT_FILE_NAME}`;

dayjs.extend(utc);
const BUILD_TIME = dayjs().utc().toISOString();

export async function writeFeedFile(entryValues: EntryValue[]): Promise<void> {
  activateI18n();
  setLocale('ja');

  const metadata = {
    title: retrieveTranslation('website.title'),
    baseUrl: SITE_URL,
    buildTime: BUILD_TIME,
  };
  const feedString = generateFeed(entryValues, metadata);
  await writeFile(DESTINATION_FILE, feedString);
}
