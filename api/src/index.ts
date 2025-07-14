import type { Hyperdrive, RateLimit } from '@cloudflare/workers-types';
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

export default api;
