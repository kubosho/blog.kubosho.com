import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertIsoStringToMilliseconds(dateIsoString: string): number {
  const r = dayjs(dateIsoString).unix() * 1000;
  return r;
}

export function formatRfc2822(dateTimeMilliseconds: number): string {
  const utc = dayjs(dateTimeMilliseconds).utc();
  const r = utc.format('ddd, DD MMM YYYY HH:mm:ss ZZ');
  return r;
}

export function formatIsoString(dateTimeMilliseconds: number): string {
  const utc = dayjs(dateTimeMilliseconds).utc();
  const r = utc.toISOString();
  return r;
}

export function formatYYMMDDString(dateTimeMilliseconds: number, separator = '.'): string {
  const utc = dayjs(dateTimeMilliseconds).utc();
  const r = utc.format(`YYYY${separator}MM${separator}DD`);
  return r;
}
