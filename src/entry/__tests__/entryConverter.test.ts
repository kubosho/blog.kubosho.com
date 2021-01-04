import { join as pathJoin } from 'path';
import { getMarkdownFileNameList, readMarkdownFileData, mapEntryValue } from '../entryConverter';
import { EntryValue } from '../entryValue';

const MOCK_DIR = pathJoin(__dirname, '..', '__mocks__');

it('getMarkdownFileNameList', async () => {
  const actualValue = (await getMarkdownFileNameList(MOCK_DIR)).length;
  const expectValue = 3;

  expect(actualValue).toBe(expectValue);
});

it('getMarkdownFileNameList: no such directory', async () => {
  const targetDir = `${MOCK_DIR}/not-found`;

  const actualValue = async (): Promise<void> => {
    await getMarkdownFileNameList(targetDir);
  };

  await expect(actualValue).rejects.toThrow();
});

it('readMarkdownFileData', async () => {
  const filepath = `${MOCK_DIR}/with-metadata.md`;

  const actualValue = await readMarkdownFileData(filepath);
  const expectValue = {
    filename: 'with-metadata',
    title: 'Hello, world',
    created_at: '2014-01-01T00:00:00.000Z',
    categories: 'test',
    tags: 'hello, world',
  };

  expect(actualValue.filename).toBe(expectValue.filename);
  expect(actualValue.title).toBe(expectValue.title);
  expect(actualValue.created_at).toBe(expectValue.created_at);
  expect(actualValue.categories).toStrictEqual(expectValue.categories);
  expect(actualValue.tags).toStrictEqual(expectValue.tags);
});

it('readMarkdownFileData: Mock file has not created_at data', async () => {
  const filepath = `${MOCK_DIR}/has-not-published-at.md`;

  const actualValue = await readMarkdownFileData(filepath);
  const expectValue = {
    filename: 'has-not-published-at',
    title: 'ビデオ会議の音声品質を高めるために買ったもの',
    tags: '日記, 仕事, ビデオ会議',
  };

  expect(actualValue.filename).toBe(expectValue.filename);
  expect(actualValue.title).toBe(expectValue.title);
  expect(actualValue.tags).toStrictEqual(expectValue.tags);
});

it('mapEntryValue', async () => {
  const mockParameter = {
    filename: 'foo-bar',
    title: 'Hello, world',
    body: 'こんにちは、世界！',
    tags: 'hello, world,test ',
    birthtime: '2020-05-13T15:34:51.620Z',
    ctime: '2020-05-13T16:32:47.520Z',
    created_at: '2014-01-01T00:00:00.000Z',
  };

  const actualValue = await mapEntryValue(mockParameter);
  const expectValue = new EntryValue({
    id: 'foo-bar',
    title: 'Hello, world',
    body: '<p>こんにちは、世界！</p>',
    excerpt: 'こんにちは、世界！',
    tags: ['hello', 'world', 'test'],
    created_at: '2014-01-01T00:00:00.000Z',
    createdAt: '2020-05-13T15:34:51.620Z',
    updatedAt: '2020-05-13T16:32:47.520Z',
  });

  expect(actualValue).toStrictEqual(expectValue);
});
