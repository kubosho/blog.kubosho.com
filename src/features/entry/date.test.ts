import { describe, expect, test } from 'vitest';

import { formatIsoString, formatRfc2822String, formatYYMDString, formatYYMMDDString } from './date';

describe('date', () => {
  test('formatIsoString()', () => {
    // Given
    const date = new Date('October 11, 1989, 13:46:00');
    const expected = '1989-10-11T04:46:00.000Z';

    // When
    const actual = formatIsoString(date);

    // Then
    expect(actual).toBe(expected);
  });

  test('formatRfc2822()', () => {
    // Given
    const date = new Date('October 11, 1989, 13:46:00');
    const expected = 'Wed, 11 Oct 1989 13:46:00 +0900';

    // When
    const actual = formatRfc2822String(date);

    // Then
    expect(actual).toBe(expected);
  });

  describe('formatYYMMDDString()', () => {
    test('default separator', () => {
      // Given
      const date = new Date('October 11, 1989, 13:46:00');
      const expected = '1989.10.11';

      // When
      const actual = formatYYMMDDString(date);

      // Then
      expect(actual).toBe(expected);
    });

    test('custom separator', () => {
      // Given
      const date = new Date('October 11, 1989, 13:46:00');
      const expected = '1989年10月11日';

      // When
      const actual = formatYYMMDDString(date, { year: '年', month: '月', day: '日' });

      // Then
      expect(actual).toBe(expected);
    });
  });

  describe('formatYYMDString()', () => {
    test('default separator', () => {
      // Given
      const date = new Date('January 1, 2024, 00:00:00');
      const expected = '2024.1.1';

      // When
      const actual = formatYYMDString(date);

      // Then
      expect(actual).toBe(expected);
    });

    test('custom separator', () => {
      // Given
      const date = new Date('January 1, 2024, 00:00:00');
      const expected = '2024年1月1日';

      // When
      const actual = formatYYMDString(date, { year: '年', month: '月', day: '日' });

      // Then
      expect(actual).toBe(expected);
    });
  });
});
