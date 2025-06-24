import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { logError } from '../utils/logger';
import { captureException, addBreadcrumb } from '../utils/sentry';

// Type definition for error response
interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

// Global error handler
export const errorHandler = async (c: Context, next: Next): Promise<Response | void> => {
  try {
    await next();
  } catch (error) {
    // Handle HTTPException
    if (error instanceof HTTPException) {
      const status = error.status;
      const message = error.message || 'HTTP Error';

      logError(error, {
        status,
        path: c.req.path,
        method: c.req.method,
      });

      // Add breadcrumb for tracking
      addBreadcrumb({
        message: `HTTP Exception: ${message}`,
        category: 'http',
        level: status >= 500 ? 'error' : 'warning',
        data: {
          status,
          path: c.req.path,
          method: c.req.method,
        },
      });

      // Only capture server errors to Sentry
      if (status >= 500) {
        captureException(error, {
          honoContext: c,
          tags: {
            type: 'http_exception',
            status: String(status),
          },
        });
      }

      const response: ErrorResponse = {
        success: false,
        error: message,
      };

      return c.json(response, status);
    }

    // Handle general errors
    if (error instanceof Error) {
      logError(error, {
        path: c.req.path,
        method: c.req.method,
        userAgent: c.req.header('user-agent'),
      });

      // Capture all unhandled errors to Sentry
      captureException(error, {
        honoContext: c,
        tags: {
          type: 'unhandled_error',
        },
        extra: {
          userAgent: c.req.header('user-agent'),
          referer: c.req.header('referer'),
        },
      });

      const response: ErrorResponse = {
        success: false,
        error: 'Internal Server Error',
      };

      return c.json(response, 500);
    }

    // Handle unknown errors
    const unknownError = new Error('Unknown error occurred');
    logError(unknownError, {
      error: String(error),
      path: c.req.path,
      method: c.req.method,
    });

    // Capture unknown errors with full context
    captureException(unknownError, {
      honoContext: c,
      tags: {
        type: 'unknown_error',
      },
      extra: {
        originalError: String(error),
        errorType: typeof error,
      },
    });

    const response: ErrorResponse = {
      success: false,
      error: 'Unknown error occurred',
    };

    return c.json(response, 500);
  }
};

// 404 handler
export const notFoundHandler = (c: Context): Response => {
  const response: ErrorResponse = {
    success: false,
    error: 'Not Found',
  };

  logError(new Error('Route not found'), {
    path: c.req.path,
    method: c.req.method,
  });

  return c.json(response, 404);
};
