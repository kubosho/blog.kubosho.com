import { EntryValue } from '../entryValue';
import { getRelatedEntryList } from '../relatedEntryList';

it('getRelatedEntryList', async () => {
  const entryListByCategory = [
    new EntryValue({
      id: 'hello-world',
      title: 'Hello, world',
      body: '<p>こんにちは、世界！</p>',
      excerpt: 'こんにちは、世界！',
      categories: ['foo', 'bar', 'test'],
      tags: ['hello', 'world', 'test'],
      created_at: '2014-01-01T00:00:00.000Z',
      createdAt: '2020-05-13T15:34:51.620Z',
      updatedAt: '2020-05-13T16:32:47.520Z',
    }),
    new EntryValue({
      id: 'foo-bar',
      title: 'Hello, world',
      body: '<p>こんにちは、世界！</p>',
      excerpt: 'こんにちは、世界！',
      categories: ['foo', 'bar', 'test'],
      tags: ['hello', 'world', 'test'],
      created_at: '2014-01-01T00:00:00.000Z',
      createdAt: '2020-05-13T15:34:51.620Z',
      updatedAt: '2020-05-13T16:32:47.520Z',
    }),
  ];

  const entryListByTags = [
    new EntryValue({
      id: 'foo-bar',
      title: 'Hello, world',
      body: '<p>こんにちは、世界！</p>',
      excerpt: 'こんにちは、世界！',
      categories: ['foo', 'bar', 'test'],
      tags: ['hello', 'world', 'test'],
      created_at: '2014-01-01T00:00:00.000Z',
      createdAt: '2020-05-13T15:34:51.620Z',
      updatedAt: '2020-05-13T16:32:47.520Z',
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
