import { DateTime } from 'luxon';

export function convertISOStringToMilliseconds(dateISOString: string): number {
  const r = DateTime.fromISO(dateISOString).toMillis();
  return r;
}

export function formatRFC2822(dateTimeMilliseconds: number): string {
  const utc = convertUTCDateTime(dateTimeMilliseconds);
  const r = utc.toRFC2822();
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
