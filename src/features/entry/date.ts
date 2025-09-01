import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatIsoString(date: Date): string {
  const r = dayjs(date).tz('Asia/Tokyo').toISOString();
  return r;
}

export function formatRfc2822String(date: Date): string {
  const r = dayjs(date).tz('Asia/Tokyo').format('ddd, DD MMM YYYY HH:mm:ss ZZ');
  return r;
}

export function formatYYMMDDString(
  date: Date,
  separator = {
    year: '.',
    month: '.',
    day: '',
  },
): string {
  const r = dayjs(date).tz('Asia/Tokyo').format(`YYYY${separator.year}MM${separator.month}DD${separator.day}`);
  return r;
}

export function formatYYMDString(
  date: Date,
  separator = {
    year: '.',
    month: '.',
    day: '',
  },
): string {
  const r = dayjs(date).tz('Asia/Tokyo').format(`YYYY${separator.year}M${separator.month}D${separator.day}`);
  return r;
}
