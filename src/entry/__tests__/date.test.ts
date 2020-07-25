import { convertISOStringToMilliseconds, formatISOString, formatRFC2822, formatYYMMDDString } from '../date';

it('convertISOStringToMilliseconds()', async () => {
  const isoString = '2011-10-05T14:48:00.000Z';

  const actualValue = convertISOStringToMilliseconds(isoString);
  const expectValue = 1317826080000;

  expect(actualValue).toBe(expectValue);
});

it('formatISOString()', async () => {
  // '2011-10-05T14:48:00.000Z'
  const milliseconds = 1317826080000;

  const actualValue = formatISOString(milliseconds);
  const expectValue = '2011-10-05T14:48:00.000Z';

  expect(actualValue).toBe(expectValue);
});

it('formatRFC2822()', async () => {
  // '2011-10-05T14:48:00.000Z'
  const milliseconds = 1317826080000;

  const actualValue = formatRFC2822(milliseconds);
  const expectValue = 'Wed, 05 Oct 2011 14:48:00 +0000';

  expect(actualValue).toBe(expectValue);
});

it('formatYYMMDDString()', async () => {
  // '2011-10-05T14:48:00.000Z'
  const milliseconds = 1317826080000;

  const actualValue = formatYYMMDDString(milliseconds);
  const expectValue = '2011/10/05';

  expect(actualValue).toBe(expectValue);
});
