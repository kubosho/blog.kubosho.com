import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { SentryErrorTracker } from '../tracker/sentry';

export const sendErrorToSentry = (error: Error | unknown, c: Context): void => {
  const tracker = c.get('errorTracker') as SentryErrorTracker | undefined;
  if (tracker == null) {
    return;
  }

  if (error instanceof HTTPException) {
    const status = error.status;
    const message = error.message || 'HTTP Error';

    tracker.addBreadcrumb({
      message: `HTTP Exception: ${message}`,
      category: 'http',
      level: status >= 500 ? 'error' : 'warning',
      data: {
        status,
        path: c.req.path,
        method: c.req.method,
      },
    });

    if (status >= 500) {
      tracker.captureException(error, {
        honoContext: c,
        tags: {
          type: 'http_exception',
          status: String(status),
          path: c.req.path,
          method: c.req.method,
        },
      });
    }
  } else if (error instanceof Error) {
    tracker.captureException(error, {
      honoContext: c,
      tags: {
        type: 'unhandled_error',
        path: c.req.path,
        method: c.req.method,
      },
      extra: {
        userAgent: c.req.header('user-agent'),
        referer: c.req.header('referer'),
      },
    });
  } else {
    const unknownError = new Error('Unknown error occurred');
    tracker.captureException(unknownError, {
      honoContext: c,
      tags: {
        type: 'unknown_error',
        path: c.req.path,
        method: c.req.method,
      },
      extra: {
        originalError: String(error),
        errorType: typeof error,
        userAgent: c.req.header('user-agent'),
        referer: c.req.header('referer'),
      },
    });
  }
};
