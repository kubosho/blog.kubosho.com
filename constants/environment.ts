import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const BUILD_TIME = dayjs().utc().toISOString();
const BUGSNAG_API_KEY = process.env.BUGSNAG_API_KEY;
const IS_ENABLE_BUNDLE_ANALYZE = process.env.BUNDLE_ANALYZE === 'true';
const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';

export { BUILD_TIME, BUGSNAG_API_KEY, IS_ENABLE_BUNDLE_ANALYZE, IS_DEVELOPMENT_ENV, IS_PRODUCTION_ENV };
