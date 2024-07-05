import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { convertMarkdownToHtml } from '../entry_converter';

describe('convertMarkdownToHtml', () => {
  test('Markdown text is converted to intended HTML', async () => {
    // Given
    const markdown = await readFile(path.resolve(__dirname, '../fixtures/sauna.md'), 'utf-8');
    const expected = await readFile(path.resolve(__dirname, '../fixtures/sauna.html'), 'utf-8');

    // When
    const htmlString = await convertMarkdownToHtml(markdown);

    // Then
    expect(htmlString).toBe(expected);
  });
});
