import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { SITE_URL } from '../../../constants/site_data';
import { generateFeed } from '../feed_generator';

describe('generateFeed()', async () => {
  test('Feed correctly', async () => {
    // Given
    const metadata = {
      title: '学ぶ、考える、書き出す。',
      description: '学習し、自分なりに噛み砕いて、書き出すブログ。',
      baseUrl: SITE_URL,
      buildTime: '2024-07-07T07:07:07.000Z',
    };
    const entryBody1 = await readFile(path.resolve(__dirname, '../../entry/__tests__/fixtures/sauna.md'), 'utf-8');
    const entryBody2 = await readFile(
      path.resolve(__dirname, '../../entry/__tests__/fixtures/remove-twitter-trend.md'),
      'utf-8',
    );
    const expected = await readFile(path.resolve(__dirname, './fixtures/feed.xml'), 'utf-8');

    // When
    const xmlString = await generateFeed(
      [
        {
          id: 'sauna.md',
          slug: 'sauna',
          body: entryBody1,
          collection: 'entries',
          data: {
            title: 'サウナで整ったけど危険性も感じた',
            excerpt: 'サウナで整う状態を初体験したけど、体験してみてこれは身体にとって危ないやつだと思った。',
            categories: ['日記'],
            publishedAt: new Date('2022-12-19T09:11:24.600Z'),
            revisedAt: new Date('2024-07-07T07:07:07.000Z'),
          },
        },
        {
          id: 'remove-twitter-trend.md',
          slug: 'remove-twitter-trend',
          body: entryBody2,
          collection: 'entries',
          data: {
            title: 'Twitterの右側サイドバーを消す',
            excerpt:
              'Twitter のトレンドを見ると、イラつきを覚えるようになりました。そんなにイラつきを覚えるようなら見なければいいし、そもそも Twitter やめろという話はあります。',
            categories: ['技術'],
            tags: ['CSS', 'Twitter'],
            publishedAt: new Date('2021-03-06T00:00:00.000Z'),
            revisedAt: new Date('2022-11-28T16:44:31.940Z'),
          },
        },
      ],
      metadata,
    );

    // Then
    expect(xmlString).toBe(expected);
  });
});
