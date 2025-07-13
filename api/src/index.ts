import { Hono } from 'hono';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import type { SentryErrorTracker } from './tracker/sentry';
import { createSentryErrorTracker } from './tracker/sentry';

export interface ApiEnv {
  Variables: {
    errorTracker: SentryErrorTracker;
  };
}

const api = new Hono<ApiEnv>();

api.use('*', async (c, next) => {
  const env = (c.env ?? {}) as Record<string, string | undefined>;
  const errorTracker = createSentryErrorTracker(env);
  c.set('errorTracker', errorTracker);
  await next();
});

api.get('/', (c) => {
  return c.text('Hello Hono!');
});

api.notFound(notFoundHandler);

api.onError((err, c) => {
  return errorHandler(err, c);
});

export default api;
