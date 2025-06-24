import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { addBreadcrumb, captureException } from '../utils/sentry';
import type { ErrorResponse } from './errorResponseType';

// Global error handler
export const errorHandler = async (c: Context, next: Next): Promise<Response | void> => {
  try {
    await next();
  } catch (error) {
    // Handle HTTPException
    if (error instanceof HTTPException) {
      const status = error.status;
      const message = error.message || 'HTTP Error';

      console.error('HTTPException:', error);

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
      console.error('Error:', error);

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
    console.error('Unknown error:', error);

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

  console.error('Route not found:', c.req.path);

  return c.json(response, 404);
};
