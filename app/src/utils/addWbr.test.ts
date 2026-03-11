import { describe, expect, test } from 'vitest';

import { addWbr } from './addWbr';

describe('addWbr', () => {
  test('inserts <wbr /> after a Japanese comma', () => {
    // Arrange
    const input = 'これは、テストです';

    // Act
    const result = addWbr(input);

    // Assert
    expect(result).toEqual('これは、<wbr />テストです');
  });

  test('returns the string unchanged when no Japanese comma is present', () => {
    // Arrange
    const input = '読点なし';

    // Act
    const result = addWbr(input);

    // Assert
    expect(result).toEqual('読点なし');
  });

  test('inserts <wbr /> after every Japanese comma', () => {
    // Arrange
    const input = '一つ、二つ、三つ';

    // Act
    const result = addWbr(input);

    // Assert
    expect(result).toEqual('一つ、<wbr />二つ、<wbr />三つ');
  });

  test('returns an empty string as-is', () => {
    // Arrange
    const input = '';

    // Act
    const result = addWbr(input);

    // Assert
    expect(result).toEqual('');
  });
});
