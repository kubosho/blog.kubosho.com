import * as Sentry from '@sentry/astro';

interface SentryConfig {
  dsn?: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}

/**
 * Initialize Sentry for client-side error tracking
 */
export function initSentry(): void {
  const config: SentryConfig = {
    dsn: import.meta.env.PUBLIC_SENTRY_DSN ?? '',
    environment: import.meta.env.MODE ?? 'development',
    release: import.meta.env.PUBLIC_RELEASE_VERSION ?? 'unknown',
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1, // 10% of sessions will be recorded
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors will be recorded
  };

  if (!config.dsn) {
    console.warn('Sentry DSN not configured, error tracking disabled');
    return;
  }

  Sentry.init({
    ...config,
    integrations: [
      // Browser tracing
      Sentry.browserTracingIntegration(),
      // Session replay
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Set sample rates
    beforeSend(event) {
      // Filter out known non-critical errors
      if (event.exception?.values?.[0]?.type === 'NetworkError') {
        // Don't send network errors in development
        if (import.meta.env.DEV) return null;
      }

      return event;
    },
  });
}

/**
 * Track user interactions
 */
export function trackInteraction(action: string, category: string, data?: Record<string, unknown>): void {
  Sentry.addBreadcrumb({
    message: action,
    category: category,
    level: 'info',
    ...(data && { data: data as { [key: string]: unknown } }),
    timestamp: Date.now() / 1000,
  });
}

/**
 * Set user context for better error tracking
 */
export function setUserContext(user?: { id?: string; email?: string }): void {
  if (user) {
    Sentry.setUser(user);
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Capture custom errors with context
 */
export function captureError(
  error: unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  },
): void {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
}
