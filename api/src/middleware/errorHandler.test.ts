import type { Context } from 'hono';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { describe, expect, test, vi } from 'vitest';

import type { ApiEnv } from '../index';
import { SentryErrorTracker } from '../tracker/sentry';
import { errorHandler, notFoundHandler } from './errorHandler';

const cleanupTest = (): void => {
  vi.clearAllMocks();
};

const setupTest = (): {
  testApp: Hono<ApiEnv>;
  mockCaptureException: ReturnType<typeof vi.fn>;
  mockAddBreadcrumb: ReturnType<typeof vi.fn>;
  mockCaptureMessage: ReturnType<typeof vi.fn>;
} => {
  cleanupTest();

  const mockCaptureException = vi.fn();
  const mockAddBreadcrumb = vi.fn();
  const mockCaptureMessage = vi.fn();

  const testApp = new Hono<ApiEnv>();

  testApp.use('*', async (c, next) => {
    const mockTracker = Object.create(SentryErrorTracker.prototype);
    Object.assign(mockTracker, {
      captureException: mockCaptureException,
      captureMessage: mockCaptureMessage,
      addBreadcrumb: mockAddBreadcrumb,
      initialized: true,
      setThreshold: vi.fn(),
      getErrorGroups: vi.fn(() => []),
      onThresholdExceeded: undefined,
    });
    c.set('errorTracker', mockTracker);
    await next();
  });

  testApp.onError((err, c) => {
    return errorHandler(err, c);
  });

  return {
    testApp,
    mockCaptureException,
    mockAddBreadcrumb,
    mockCaptureMessage,
  };
};

describe('errorHandler', () => {
  test('captures HTTPException with status 500+ to Sentry', async () => {
    // Given
    const { testApp, mockCaptureException, mockAddBreadcrumb } = setupTest();
    testApp.get('/test/error', () => {
      throw new HTTPException(500, { message: 'Internal Server Error' });
    });

    // When
    const res = await testApp.request('/test/error');
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    // Then
    expect(res.status).toBe(500);
    expect(data).toEqual({
      success: false,
      message: 'Internal Server Error',
    });
    expect(mockAddBreadcrumb).toHaveBeenCalledWith({
      message: 'HTTP Exception: Internal Server Error',
      category: 'http',
      level: 'error',
      data: {
        status: 500,
        path: '/test/error',
        method: 'GET',
      },
    });
    expect(mockCaptureException).toHaveBeenCalledWith(
      expect.any(HTTPException),
      expect.objectContaining({
        tags: {
          type: 'http_exception',
          status: '500',
          path: '/test/error',
          method: 'GET',
        },
      }),
    );
  });

  test('does not capture HTTPException with status < 500 to Sentry', async () => {
    // Given
    const { testApp, mockCaptureException, mockAddBreadcrumb } = setupTest();
    testApp.get('/test/not-found', () => {
      throw new HTTPException(404, { message: 'Not Found' });
    });

    // When
    const res = await testApp.request('/test/not-found');
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    // Then
    expect(res.status).toBe(404);
    expect(data).toEqual({
      success: false,
      message: 'Not Found',
    });
    expect(mockAddBreadcrumb).toHaveBeenCalledWith({
      message: 'HTTP Exception: Not Found',
      category: 'http',
      level: 'warning',
      data: {
        status: 404,
        path: '/test/not-found',
        method: 'GET',
      },
    });
    expect(mockCaptureException).not.toHaveBeenCalled();
  });

  test('captures regular Error to Sentry', async () => {
    // Given
    const { testApp, mockCaptureException } = setupTest();
    testApp.get('/test/error', () => {
      throw new Error('Something went wrong');
    });

    // When
    const res = await testApp.request('/test/error', {
      headers: {
        'user-agent': 'Test User Agent',
        referer: 'https://example.com',
      },
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    // Then
    expect(res.status).toBe(500);
    expect(data).toEqual({
      success: false,
      message: 'Internal Server Error',
    });
    expect(mockCaptureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        tags: {
          type: 'unhandled_error',
          path: '/test/error',
          method: 'GET',
        },
        extra: {
          userAgent: 'Test User Agent',
          referer: 'https://example.com',
        },
      }),
    );
  });

  test('handles unknown errors', async () => {
    // Given
    const { testApp } = setupTest();
    testApp.get('/test/error', () => {
      throw 'string error';
    });

    // When
    let error: unknown;
    try {
      await testApp.request('/test/error');
    } catch (e) {
      error = e;
    }

    // Then
    expect(error).toBeDefined();
    expect(error).toBe('string error');
  });
});

describe('notFoundHandler', () => {
  test('returns 404 with proper error response', () => {
    // Given
    const mockContext = {
      req: {
        path: '/non-existent-path',
      },
      json: vi.fn((data, status) => ({ data, status })),
    };

    // When
    const result = notFoundHandler(mockContext as unknown as Context);

    // Then
    expect(mockContext.json).toHaveBeenCalledWith(
      {
        success: false,
        message: 'Not Found',
      },
      404,
    );
    expect(result).toEqual({
      data: {
        success: false,
        message: 'Not Found',
      },
      status: 404,
    });
  });
});
