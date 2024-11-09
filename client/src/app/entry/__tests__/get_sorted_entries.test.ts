import { describe, expect, test } from 'vitest';

import { collectionEntryFactory } from '../__mocks__/collection_entry.factory';
import { getSortedEntries } from '../get_sorted_entries';
import type { TinyCollectionEntry } from '../tiny_collection_entry';

function getCollectionEntry(publishedAt: Date): TinyCollectionEntry {
  const sharedProperty = {
    body: '# Entry 1\n\nThis is the body of entry 1.',
    collection: 'entries',
    id: 'why-focus-on-improving-accessibility.md',
    slug: 'why-focus-on-improving-accessibility',
  } as const;

  return collectionEntryFactory.build({
    ...sharedProperty,
    data: {
      publishedAt,
      title: 'Why focus on improving accessibility',
    },
  });
}

describe('getSortedEntries', () => {
  test('should sort entries by publishedAt in descending order', async () => {
    // Given
    const entries = [
      getCollectionEntry(new Date('2021-01-01')),
      getCollectionEntry(new Date('2021-01-03')),
      getCollectionEntry(new Date('2021-01-02')),
    ];
    const expected = [
      getCollectionEntry(new Date('2021-01-03')),
      getCollectionEntry(new Date('2021-01-02')),
      getCollectionEntry(new Date('2021-01-01')),
    ];

    // When
    const sortedEntries = getSortedEntries(entries);

    // Then
    expect(sortedEntries).toEqual(expected);
  });
});
