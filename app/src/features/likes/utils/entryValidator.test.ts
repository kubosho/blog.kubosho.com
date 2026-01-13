import { describe, expect, test } from 'vitest';

import { isValidEntryIdFormat } from './entryValidator';

describe('isValidEntryIdFormat', () => {
  test('should return true for valid entry IDs', () => {
    expect(isValidEntryIdFormat('blog-post-1')).toBe(true);
    expect(isValidEntryIdFormat('my-entry')).toBe(true);
    expect(isValidEntryIdFormat('a')).toBe(true);
    expect(isValidEntryIdFormat('a1')).toBe(true);
    expect(isValidEntryIdFormat('test123')).toBe(true);
    expect(isValidEntryIdFormat('my-blog-post-2024')).toBe(true);
  });

  test('should return false for null or undefined', () => {
    expect(isValidEntryIdFormat(null as unknown as string)).toBe(false);
    expect(isValidEntryIdFormat(undefined)).toBe(false);
  });

  test('should return false for empty string', () => {
    expect(isValidEntryIdFormat('')).toBe(false);
  });

  test('should return false for IDs starting or ending with hyphen', () => {
    expect(isValidEntryIdFormat('-invalid')).toBe(false);
    expect(isValidEntryIdFormat('invalid-')).toBe(false);
    expect(isValidEntryIdFormat('-invalid-')).toBe(false);
  });

  test('should return false for IDs with uppercase letters', () => {
    expect(isValidEntryIdFormat('MyEntry')).toBe(false);
    expect(isValidEntryIdFormat('ENTRY')).toBe(false);
  });

  test('should return false for IDs with special characters', () => {
    expect(isValidEntryIdFormat('entry_name')).toBe(false);
    expect(isValidEntryIdFormat('entry.name')).toBe(false);
    expect(isValidEntryIdFormat('entry/name')).toBe(false);
    expect(isValidEntryIdFormat('entry name')).toBe(false);
    expect(isValidEntryIdFormat('entry@name')).toBe(false);
  });

  test('should return false for IDs exceeding max length', () => {
    const longId = 'a'.repeat(51);
    expect(isValidEntryIdFormat(longId)).toBe(false);
  });

  test('should return true for IDs at max length', () => {
    const maxLengthId = 'a'.repeat(50);
    expect(isValidEntryIdFormat(maxLengthId)).toBe(true);
  });
});
