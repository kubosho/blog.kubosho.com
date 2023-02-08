const BUGSNAG_API_KEY = import.meta.env.BUGSNAG_API_KEY;
const IS_ENABLE_BUNDLE_ANALYZE = import.meta.env.BUNDLE_ANALYZE === 'true';
const IS_DEVELOPMENT_ENV = import.meta.env.MODE === 'development';
const IS_PRODUCTION_ENV = import.meta.env.MODE === 'production';

export { BUGSNAG_API_KEY, IS_ENABLE_BUNDLE_ANALYZE, IS_DEVELOPMENT_ENV, IS_PRODUCTION_ENV };
