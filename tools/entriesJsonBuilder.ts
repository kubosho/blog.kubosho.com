import { join as pathJoin } from 'path';
import { writeFile as legacyWriteFile } from 'fs';
import { promisify } from 'util';
import ora from 'ora';

import { EntryValue } from '../src/entry/entryValue';
import { retrieveMarkdownFiles, readMarkdownFileData, mapEntryValueParameter } from '../src/entry/entryConverter';

const writeFile = promisify(legacyWriteFile);

const BASE_DIR = pathJoin(__dirname, '..');

const SRC_DIR = `${BASE_DIR}/entries`;
const DRAFT_DIR = `${BASE_DIR}/entries/draft`;

const DIST_DIR = 'data';
const OUTPUT_FILE = 'entries.json';
const DESTINATION_FILE = `${BASE_DIR}/${DIST_DIR}/${OUTPUT_FILE}`;

async function readEntryList(sourceDir: string, ignoreDir?: string): Promise<Array<EntryValue>> {
  const markdownFiles = await retrieveMarkdownFiles(sourceDir);
  const filteredMarkdownFiles = markdownFiles.filter((filepath) => !filepath.includes(ignoreDir));
  const entriesData = filteredMarkdownFiles.map(async (file) => await readMarkdownFileData(file));
  const params = entriesData.map((data) => data.then(mapEntryValueParameter));
  const values = params.map((param) => param.then((p) => new EntryValue(p)));
  const entries = await Promise.all(values);

  return entries;
}

export async function main(): Promise<void> {
  const spinner = ora('Entry list create staring.').start();

  const entryList = (await readEntryList(SRC_DIR, DRAFT_DIR))
    .sort((e1, e2) => e2.createdAt - e1.createdAt)
    .map((entry) => [entry.id, entry]);
  const entries = Object.fromEntries(entryList);

  spinner.text = 'Entry list are created.';

  const json = JSON.stringify(entries);
  await writeFile(DESTINATION_FILE, json);

  spinner.succeed(`Entry list data written to "${DESTINATION_FILE}" !`);
}

main();
