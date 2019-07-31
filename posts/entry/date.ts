import { DateTime } from 'luxon';

export function convertISOStringToDateTime(dateISOString: string): DateTime {
  const r = DateTime.fromISO(dateISOString);
  return r;
}

export function formatISOString(dateTimeMilliseconds: number): string {
  const utc = convertUTCDateTime(dateTimeMilliseconds);
  const r = utc.toISO();
  return r;
}

export function formatYYMMDDString(dateTimeMilliseconds: number): string {
  const utc = convertUTCDateTime(dateTimeMilliseconds);
  const r = utc.toFormat('yyyy/MM/dd');
  return r;
}

function convertUTCDateTime(dateTimeMilliseconds: number): DateTime {
  const r = DateTime.fromMillis(dateTimeMilliseconds).toUTC();
  return r;
}
