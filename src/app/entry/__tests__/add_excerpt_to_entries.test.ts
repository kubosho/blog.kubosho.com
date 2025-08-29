import { describe, expect, test } from 'vitest';

import { collectionEntryFactory } from '../__mocks__/collection_entry.factory';
import { addExcerptToEntries } from '../add_excerpt_to_entries';
import type { TinyCollectionEntry } from '../tiny_collection_entry';

function getCollectionEntry(): TinyCollectionEntry {
  const body = `このブログではGoogle Analyticsを導入しています。Google Analyticsによるアクセス解析をオプトアウトできるように、今までは[nanostores/react](https://github.com/nanostores/react)を使ってオプトアウト機能を実装して、オプトアウトの状態管理をしていました。

しかしオプトアウトの状態を管理するためだけにライブラリを使うのはオーバーエンジニアリングだと考えたのと、ページの初期レンダリング時にUIと状態が合わないことが気になっていました。`;

  return collectionEntryFactory.build({
    body,
  });
}

describe('addExcerptToEntries', () => {
  test('should add excerpt to entries', async () => {
    // Given
    const entries = [getCollectionEntry()];
    const expected =
      'このブログではGoogle Analyticsを導入しています。Google Analyticsによるアクセス解析をオプトアウトできるように、今まではnanostores/reactを使ってオプトアウト機能を実装して、オプトアウトの状態管理をしていました。';

    // When
    const result = await addExcerptToEntries(entries);

    // Then
    expect(result[0]?.data.excerpt).toBe(expected);
  });
});
