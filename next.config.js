const bundleAnalyzer = require('@next/bundle-analyzer');
const {
  BUGSNAG_API_KEY,
  BUILD_TIME,
  ENABLE_BUNDLE_ANALYZE,
  NEXT_PUBLIC_VERCEL_ENV,
} = require('./src/constants/environment');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: ENABLE_BUNDLE_ANALYZE,
});

const config = {
  env: {
    BUILD_TIME,
    BUGSNAG_API_KEY,
    NEXT_PUBLIC_VERCEL_ENV,
  },
};

module.exports = withBundleAnalyzer(config);
