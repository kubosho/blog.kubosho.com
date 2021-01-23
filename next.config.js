const bundleAnalyzer = require('@next/bundle-analyzer');
const { BUGSNAG_API_KEY, BUILD_TIME, ENABLE_BUNDLE_ANALYZE } = require('./src/constants/environment');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: ENABLE_BUNDLE_ANALYZE,
});

const config = {
  env: {
    BUILD_TIME,
    BUGSNAG_API_KEY,
  },
};

module.exports = withBundleAnalyzer(config);
