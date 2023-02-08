const bundleAnalyzer = require('@next/bundle-analyzer');

const {
  BUGSNAG_API_KEY,
  BUILD_TIME,
  ENABLE_BUNDLE_ANALYZE,
  NEXT_PUBLIC_VERCEL_ENV,
} = require('./constants/environment');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: ENABLE_BUNDLE_ANALYZE,
});

const config = {
  reactStrictMode: true,
  env: {
    BUILD_TIME,
    BUGSNAG_API_KEY,
    NEXT_PUBLIC_VERCEL_ENV,
  },
  redirects() {
    return [
      {
        source: '/entry/:id',
        destination: '/entries/:id',
        permanent: true,
      },
    ];
  },
  rewrites() {
    return [
      {
        destination: '/api/feed',
        source: '/feed',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
