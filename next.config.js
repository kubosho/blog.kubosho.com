const bundleAnalyzer = require('@next/bundle-analyzer');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.BUNDLE_ANALYZE === 'true',
});

const config = {
  env: {
    BUGSNAG_API_KEY: process.env.BUGSNAG_API_KEY,
  },
};

module.exports = withBundleAnalyzer(config);
