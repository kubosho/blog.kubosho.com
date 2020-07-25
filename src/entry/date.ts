import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function convertISOStringToMilliseconds(dateISOString: string): number {
  const r = dayjs(dateISOString).unix() * 1000;
  return r;
}

export function formatRFC2822(dateTimeMilliseconds: number): string {
  const utc = dayjs(dateTimeMilliseconds).utc();
  const r = utc.format('ddd, DD MMM YYYY HH:mm:ss ZZ');
  return r;
}

export function formatISOString(dateTimeMilliseconds: number): string {
  const utc = dayjs(dateTimeMilliseconds).utc();
  const r = utc.toISOString();
  return r;
}

export function formatYYMMDDString(dateTimeMilliseconds: number): string {
  const utc = dayjs(dateTimeMilliseconds).utc();
  const r = utc.format('YYYY/MM/DD');
  return r;
}
