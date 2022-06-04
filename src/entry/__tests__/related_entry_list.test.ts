import { expect, test } from 'vitest';
import { EntryValue } from '../entry_value';
import { getRelatedEntryList } from '../related_entry_list';

test('getRelatedEntryList', async () => {
  const entryListByCategory = [
    new EntryValue({
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
    }),
    new EntryValue({
      id: 'foo-bar',
      slug: 'foo-bar',
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
    }),
  ];

  const entryListByTags = [
    new EntryValue({
      id: 'foo-bar',
      slug: 'foo-bar',
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
    }),
  ];

  const actualValue = await getRelatedEntryList('hello-world', entryListByCategory, entryListByTags);
  const expectValue = [
    {
      id: 'foo-bar',
      title: 'Hello, world',
    },
  ];

  expect(actualValue).toStrictEqual(expectValue);
});
