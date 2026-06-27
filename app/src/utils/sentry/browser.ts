import type { Breadcrumb, CaptureContext } from '@sentry/browser';
import * as Sentry from '@sentry/browser';

const BOT_USER_AGENT_PATTERN = /bot|crawl|spider|slurp|bingpreview|mediapartners|headlesschrome/i;

let isInitialized = false;

export function initBrowserSentry(): void {
  if (isInitialized || import.meta.env.PUBLIC_SENTRY_DSN == null || import.meta.env.PUBLIC_SENTRY_DSN === '') {
    return;
  }

  isInitialized = true;
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
}

export function addSentryBreadcrumb(breadcrumb: Breadcrumb): void {
  Sentry.addBreadcrumb(breadcrumb);
}

export function captureSentryException(error: unknown, context?: CaptureContext): void {
  Sentry.captureException(error, context);
}
