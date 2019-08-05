import { writeFile as legacyWriteFile } from 'fs';
import { promisify } from 'util';
import { Nullable } from 'option-t/lib/Nullable/Nullable';

import { EntryValue } from '../entry/entryValue';
import { entryGateway } from '../entry/entryContext';

const writeFile = promisify(legacyWriteFile);

const CWD = process.cwd();
const DIST_DIR = 'data';
const OUTPUT_FILE = 'entries.json';
const DESTINATION_FILE = `${CWD}/${DIST_DIR}/${OUTPUT_FILE}`;

function progressMessage(message: string) {
  // tslint:disable-next-line: no-console
  console.log(message);
}

export async function getContentfulContents() {
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
