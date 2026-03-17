import * as Sentry from '@sentry/astro';

const BOT_USER_AGENT_PATTERN = /bot|crawl|spider|slurp|bingpreview|mediapartners|headlesschrome/i;

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    if (BOT_USER_AGENT_PATTERN.test(navigator.userAgent)) {
      return null;
    }
    return event;
  },
});
