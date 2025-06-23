import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { logError } from '../utils/logger';

// エラーレスポンスの型定義
interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
}

// Global error handler
export const errorHandler = async (c: Context, next: Next): Promise<Response | void> => {
  try {
    await next();
  } catch (error) {
    // HTTPExceptionの場合
    if (error instanceof HTTPException) {
      const status = error.status;
      const message = error.message || 'HTTP Error';

      logError(error, {
        status,
        path: c.req.path,
        method: c.req.method,
      });

      const response: ErrorResponse = {
        success: false,
        error: message,
      };

      return c.json(response, status);
    }

    // 一般的なエラーの場合
    if (error instanceof Error) {
      logError(error, {
        path: c.req.path,
        method: c.req.method,
        userAgent: c.req.header('user-agent'),
      });

      const response: ErrorResponse = {
        success: false,
        error: 'Internal Server Error',
      };

      return c.json(response, 500);
    }

    // 不明なエラーの場合
    logError(new Error('Unknown error occurred'), {
      error: String(error),
      path: c.req.path,
      method: c.req.method,
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
