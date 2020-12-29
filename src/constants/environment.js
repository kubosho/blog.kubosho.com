const BUGSNAG_API_KEY = process.env.BUGSNAG_API_KEY;
const IS_ENABLE_BUNDLE_ANALYZE = process.env.BUNDLE_ANALYZE === 'true';
const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
const IS_PRODUCTION_ENV = process.env.NODE_ENV === 'production';

module.exports = {
  BUGSNAG_API_KEY,
  IS_ENABLE_BUNDLE_ANALYZE,
  IS_DEVELOPMENT_ENV,
  IS_PRODUCTION_ENV,
};
