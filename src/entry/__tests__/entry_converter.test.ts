import { expect, test } from 'vitest';
import { mapEntryValue } from '../entry_converter';
import { EntryValue } from '../entry_value';

test('mapEntryValue', async () => {
  const mockParameter = {
    id: 'foo-bar',
    slug: 'foo-bar',
    title: 'Hello, world',
    body: 'こんにちは、世界！',
    excerpt: undefined,
    categories: [],
    tags: ['hello', 'world', 'test'],
    heroImage: undefined,
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    publishedAt: '2020-01-01T00:00:00.000Z',
    revisedAt: '2020-01-01T00:00:00.000Z',
  };

  const actualValue = await mapEntryValue(mockParameter);
  const expectValue = new EntryValue({
    id: 'foo-bar',
    slug: 'foo-bar',
    title: 'Hello, world',
    body: '<p>こんにちは、世界！</p>',
    excerpt: 'こんにちは、世界！',
    categories: [],
    tags: ['hello', 'world', 'test'],
    heroImage: undefined,
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    publishedAt: '2020-01-01T00:00:00.000Z',
    revisedAt: '2020-01-01T00:00:00.000Z',
  });

  expect(actualValue).toStrictEqual(expectValue);
});
