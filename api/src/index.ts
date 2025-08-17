import type { Hyperdrive, RateLimit } from '@cloudflare/workers-types';
import * as Sentry from '@sentry/cloudflare';
import { Hono } from 'hono';

import { cors } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logging } from './middleware/logging';
import { rateLimit } from './middleware/rateLimit';
import likes from './routes/likes';
import type { SentryErrorTracker } from './tracker/sentry';
import { createSentryErrorTracker } from './tracker/sentry';

export interface ApiEnv {
  Bindings: {
    DATABASE_URL?: string;
    HYPERDRIVE?: Hyperdrive;
    RATE_LIMITER?: RateLimit;
    SENTRY_DSN?: string;
    ENVIRONMENT?: string;
    RELEASE_VERSION?: string;
  };
  Variables: {
    errorTracker: SentryErrorTracker;
  };
}

const api = new Hono<ApiEnv>();

api.use('*', cors());
api.use('*', rateLimit());
api.use('*', logging());
api.use('*', async (c, next) => {
  const env = (c.env ?? {}) as Record<string, string | undefined>;
  const errorTracker = createSentryErrorTracker(env);
  c.set('errorTracker', errorTracker);
  await next();
});

api.get('/', (c) => {
  return c.text('Hello Hono!');
});

api.route('/', likes);

api.notFound(notFoundHandler);

api.onError((err, c) => {
  return errorHandler(err, c);
});

// Export the raw app
export { api };

// Export the app wrapped with Sentry
export default Sentry.withSentry(
  (env: ApiEnv['Bindings']) => ({
    dsn: env.SENTRY_DSN,
    environment: env.ENVIRONMENT || 'development',
    release: env.RELEASE_VERSION || 'unknown',
    tracesSampleRate: env.ENVIRONMENT === 'production' ? 0.1 : 1.0,
    beforeSend: (event) => {
      // Filter out sensitive data if needed
      return event;
    },
  }),
  api,
);
