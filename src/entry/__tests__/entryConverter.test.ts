import { mapEntryValue } from '../entryConverter';
import { EntryValue } from '../entryValue';

// HACK:
// Fix "ReferenceError: You are trying to `import` a file after the Jest environment has been torn down."
// https://stackoverflow.com/questions/67178109/jest-throwing-reference-error-about-an-import-inside-a-node-modules-dependency
afterAll((done) => {
  setTimeout(done, 0);
});

it('mapEntryValue', async () => {
  const mockParameter = {
    id: 'foo-bar',
    slug: 'foo-bar',
    title: 'Hello, world',
    body: 'こんにちは、世界！',
    categories: [],
    tags: ['hello', 'world', 'test'],
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
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    publishedAt: '2020-01-01T00:00:00.000Z',
    revisedAt: '2020-01-01T00:00:00.000Z',
  });

  expect(actualValue).toStrictEqual(expectValue);
});
