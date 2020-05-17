import { join as pathJoin } from 'path';
import { retrieveMarkdownFiles, readMarkdownFileData, mapEntryValueParameter } from '../entryConverter';

const BASE_DIR = pathJoin(__dirname, '.');

it('retrieveMarkdownFiles', async () => {
  const targetDir = `${BASE_DIR}/mock`;

  const actualValue = await retrieveMarkdownFiles(targetDir);
  const expectValue = [`${targetDir}/hello-world.md`, `${targetDir}/with-metadata.md`];

  expect(actualValue).toStrictEqual(expectValue);
});

it('retrieveMarkdownFiles: no such directory', async () => {
  const targetDir = `${BASE_DIR}/mock/not-found`;

  const actualValue = async (): Promise<void> => {
    await retrieveMarkdownFiles(targetDir);
  };

  await expect(actualValue).rejects.toThrow();
});

it('readMarkdownFileData', async () => {
  const filepath = `${BASE_DIR}/mock/with-metadata.md`;

  const actualValue = await readMarkdownFileData(filepath);
  const expectValue = {
    filename: 'with-metadata',
    title: 'Hello, world',
    publishedAt: '2014-01-01T00:00:00.000Z',
    tags: 'hello, world, test',
  };

  expect(actualValue.filename).toBe(expectValue.filename);
  expect(actualValue.title).toBe(expectValue.title);
  expect(actualValue.publishedAt).toBe(expectValue.publishedAt);
  expect(actualValue.tags).toStrictEqual(expectValue.tags);
});

it('mapEntryValueParameter', async () => {
  const mockParameter = {
    filename: 'foo-bar',
    title: 'Hello, world',
    body: 'こんにちは、世界！',
    tags: 'hello, world,test ',
    birthtime: '2020-05-13T15:34:51.620Z',
    ctime: '2020-05-13T16:32:47.520Z',
    publishedAt: '2014-01-01T00:00:00.000Z',
  };

  const actualValue = await mapEntryValueParameter(mockParameter);
  const expectValue = {
    id: 'foo-bar',
    title: 'Hello, world',
    body: '<p>こんにちは、世界！</p>\n',
    excerpt: 'こんにちは、世界！\n',
    tags: ['hello', 'world', 'test'],
    publishedAt: '2014-01-01T00:00:00.000Z',
    createdAt: '2020-05-13T15:34:51.620Z',
    updatedAt: '2020-05-13T16:32:47.520Z',
  };

  expect(actualValue).toStrictEqual(expectValue);
});
