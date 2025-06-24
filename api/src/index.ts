import { Hono } from 'hono';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { initSentry, sentryMiddleware } from './utils/sentry';

const app = new Hono();

// Initialize Sentry on each request
app.use('*', async (c, next) => {
  // Initialize Sentry with request context
  initSentry(
    c.req.raw,
    c.env as Record<string, string | undefined>,
    c.executionCtx as unknown as Record<string, unknown>,
  );
  await next();
});

// Apply Sentry middleware for error tracking
app.use('*', sentryMiddleware);

// Apply global error handler
app.use('*', errorHandler);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Apply 404 handler
app.notFound(notFoundHandler);

export default app;
