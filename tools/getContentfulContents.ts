import { join as pathJoin } from 'path';
import { writeFile as legacyWriteFile } from 'fs';
import { promisify } from 'util';
import { Nullable } from 'option-t/lib/Nullable/Nullable';

import { EntryValue } from '../src/entry/entryValue';
import { entryGateway } from '../src/entry/entryContext';

const writeFile = promisify(legacyWriteFile);

const BASE_DIR = pathJoin(__dirname, '..');
const DIST_DIR = 'data';
const OUTPUT_FILE = 'entries.json';
const DESTINATION_FILE = `${BASE_DIR}/${DIST_DIR}/${OUTPUT_FILE}`;

function progressMessage(message: string): void {
  // tslint:disable-next-line: no-console
  console.log(message);
}

export async function getContentfulContents(): Promise<void> {
  let entries: Nullable<ReadonlyArray<EntryValue>> = null;

  progressMessage('> Starting contents fetch');

  try {
    entries = await entryGateway.fetchAllEntries();
  } catch (err) {
    throw new Error(err);
  }

  progressMessage('> Fetched contents');

  const json = JSON.stringify(entries);
  await writeFile(DESTINATION_FILE, json);

  progressMessage(`> Contents written to ${DESTINATION_FILE}`);
}

getContentfulContents();
