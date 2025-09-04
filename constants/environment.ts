const IS_ENABLE_BUNDLE_ANALYZE = import.meta.env.BUNDLE_ANALYZE === 'true';
const IS_DEVELOPMENT_ENV = import.meta.env.MODE === 'development';
const IS_PRODUCTION_ENV = import.meta.env.MODE === 'production';

export { IS_DEVELOPMENT_ENV, IS_ENABLE_BUNDLE_ANALYZE, IS_PRODUCTION_ENV };
