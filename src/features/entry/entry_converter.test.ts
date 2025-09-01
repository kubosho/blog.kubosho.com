import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { convertMarkdownToHtml, convertMarkdownToPlainText } from './entry_converter';

describe('EntryConverter', () => {
  describe('convertMarkdownToHtml', () => {
    test('Markdown text is converted to intended HTML', async () => {
      // Given
      const markdown = await readFile(path.resolve(__dirname, './fixtures/i-entered-kua.md'), 'utf-8');
      const expected = await readFile(path.resolve(__dirname, './fixtures/i-entered-kua.html'), 'utf-8');

      // When
      const htmlString = await convertMarkdownToHtml(markdown);

      // Then
      expect(htmlString).toBe(expected);
    });
  });

  describe('convertMarkdownToPlainText', () => {
    test('Markdown text is converted to intended plain text', async () => {
      // Given
      const markdown = await readFile(path.resolve(__dirname, './fixtures/i-entered-kua.md'), 'utf-8');
      const expected = await readFile(path.resolve(__dirname, './fixtures/i-entered-kua.txt'), 'utf-8');

      // When
      const plainText = await convertMarkdownToPlainText(markdown);

      // Then
      expect(plainText).toBe(expected);
    });
  });
});
