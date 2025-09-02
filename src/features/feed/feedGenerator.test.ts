import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { SITE_URL } from '../../../constants/site_data';
import { generateFeed } from './feedGenerator';

describe('generateFeed()', async () => {
  test('Feed correctly', async () => {
    // Given
    const metadata = {
      title: '学ぶ、考える、書き出す。',
      description: '学習し、自分なりに噛み砕いて、書き出すブログ。',
      baseUrl: SITE_URL,
      buildTime: '2024-07-07T07:07:07.000Z',
    };
    const entryBody1 = await readFile(path.resolve(__dirname, '../entry/__fixtures__/i-entered-kua.md'), 'utf-8');
    const entryBody2 = await readFile(
      path.resolve(__dirname, '../entry/__fixtures__/remove-twitter-trend.md'),
      'utf-8',
    );
    const expected = await readFile(path.resolve(__dirname, './__fixtures__/feed.xml'), 'utf-8');

    // When
    const xmlString = await generateFeed(
      [
        {
          id: 'i-entered-kua.md',
          slug: 'i-entered-kua',
          body: entryBody1,
          collection: 'entries',
          data: {
            title: '京都芸術大学(KUA) 通信教育部芸術学部デザイン科イラストレーションコースに入学した',
            excerpt: '2022年4月からイラストを本気で学ぶべく大学に入学した話です。',
            categories: ['人生'],
            publishedAt: new Date('2022-04-01T00:00:02.988Z'),
            revisedAt: new Date('2022-11-28T13:50:50.369Z'),
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
