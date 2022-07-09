import { expect, test } from 'vitest';
import { EntryValue } from '../entry_value';
import { getRelatedEntryList } from '../related_entry_list';

test('getRelatedEntryList', async () => {
  const mockEntryValue1 = new EntryValue({
    id: 'hello-world',
    slug: 'hello-world',
    title: 'Hello, world',
    body: '<p>こんにちは、世界！</p>',
    excerpt: 'こんにちは、世界！',
    categories: ['foo', 'bar', 'test'],
    tags: ['hello', 'world', 'test'],
    heroImage: undefined,
    originalCreatedAt: undefined,
    originalRevisedAt: undefined,
    createdAt: '2020-05-13T15:34:51.620Z',
    updatedAt: '2020-05-13T16:32:47.520Z',
    publishedAt: '2020-05-13T15:34:51.620Z',
    revisedAt: '2020-05-13T16:32:47.520Z',
  });

  const mockEntryValue2 = new EntryValue({
    id: 'example',
    slug: 'example',
    title: 'Example',
    body: '<p>サンプルです</p>',
    excerpt: '要約のサンプルです',
    categories: ['foo', 'bar', 'test'],
    tags: ['example', 'test'],
    heroImage: undefined,
    originalCreatedAt: undefined,
    originalRevisedAt: undefined,
    createdAt: '2020-05-13T15:34:51.620Z',
    updatedAt: '2020-05-13T16:32:47.520Z',
    publishedAt: '2020-05-13T15:34:51.620Z',
    revisedAt: '2020-05-13T16:32:47.520Z',
  });

  const mockEntryId = 'mock-entry-id';
  const mockEntryListByCategory = [mockEntryValue1];
  const mockEntryListByTags = [mockEntryValue2];

  const actualValue = await getRelatedEntryList(mockEntryId, mockEntryListByCategory, mockEntryListByTags);
  const expectValue = [...mockEntryListByTags, ...mockEntryListByCategory];

  expect(actualValue).toStrictEqual(expectValue);
});
