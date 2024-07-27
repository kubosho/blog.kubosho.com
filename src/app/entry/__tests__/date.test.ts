import { describe, expect, test } from 'vitest';

import { convertIsoStringToMilliseconds, formatIsoString, formatRfc2822, formatYYMMDDString } from '../date';

describe('date', () => {
  test('convertIsoStringToMilliseconds()', async () => {
    const isoString = '2011-10-05T14:48:00.000Z';

    const actualValue = convertIsoStringToMilliseconds(isoString);
    const expectValue = 1317826080000;

    expect(actualValue).toBe(expectValue);
  });

  test('formatIsoString()', async () => {
    // '2011-10-05T14:48:00.000Z'
    const milliseconds = 1317826080000;

    const actualValue = formatIsoString(milliseconds);
    const expectValue = '2011-10-05T14:48:00.000Z';

    expect(actualValue).toBe(expectValue);
  });

  test('formatRfc2822()', async () => {
    // '2011-10-05T14:48:00.000Z'
    const milliseconds = 1317826080000;

    const actualValue = formatRfc2822(milliseconds);
    const expectValue = 'Wed, 05 Oct 2011 14:48:00 +0000';

    expect(actualValue).toBe(expectValue);
  });

  test('formatYYMMDDString()', async () => {
    // '2011-10-05T14:48:00.000Z'
    const milliseconds = 1317826080000;

    const actualValue = formatYYMMDDString(milliseconds);
    const expectValue = '2011.10.05';

    expect(actualValue).toBe(expectValue);
  });

  test('formatYYMMDDString(): set separator argument', async () => {
    // '2011-10-05T14:48:00.000Z'
    const milliseconds = 1317826080000;

    const actualValue = formatYYMMDDString(milliseconds, '-');
    const expectValue = '2011-10-05';

    expect(actualValue).toBe(expectValue);
  });
});
