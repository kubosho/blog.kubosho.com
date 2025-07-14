import type { Context } from 'hono';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { describe, expect, test, vi } from 'vitest';

import type { ApiEnv } from '../index';
import { SentryErrorTracker } from '../tracker/sentry';
import { errorHandler, notFoundHandler } from './errorHandler';

interface MockJsonResponse {
  data: unknown;
  status: number;
}

interface MockContext {
  req: {
    path: string;
  };
  json: (data: unknown, status: number) => MockJsonResponse;
}

const cleanupTest = (): void => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (): {
  testApp: Hono<ApiEnv>;
  mockCaptureException: ReturnType<typeof vi.fn>;
  mockAddBreadcrumb: ReturnType<typeof vi.fn>;
  mockCaptureMessage: ReturnType<typeof vi.fn>;
  consoleErrorSpy: ReturnType<typeof vi.spyOn>;
} => {
  cleanupTest();

  const mockCaptureException = vi.fn();
  const mockAddBreadcrumb = vi.fn();
  const mockCaptureMessage = vi.fn();
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

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
    consoleErrorSpy,
  };
};

describe('errorHandler', () => {
  test('returns 500 status and error message for HTTPException with status 500+', async () => {
    // Given
    const { testApp } = setupTest();
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
  });

  test('adds error breadcrumb for HTTPException with status 500+', async () => {
    // Given
    const { testApp, mockAddBreadcrumb } = setupTest();
    testApp.get('/test/error', () => {
      throw new HTTPException(500, { message: 'Internal Server Error' });
    });

    // When
    await testApp.request('/test/error');

    // Then
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
  });

  test('captures HTTPException instance', async () => {
    // Given
    const { testApp, mockCaptureException } = setupTest();
    testApp.get('/test/error', () => {
      throw new HTTPException(500, { message: 'Internal Server Error' });
    });

    // When
    await testApp.request('/test/error');

    // Then
    expect(mockCaptureException).toHaveBeenCalled();
    const [error] = mockCaptureException.mock.calls[0];
    expect(error).toBeInstanceOf(HTTPException);
  });

  test('captures HTTPException with proper context tags', async () => {
    // Given
    const { testApp, mockCaptureException } = setupTest();
    testApp.get('/test/error', () => {
      throw new HTTPException(500, { message: 'Internal Server Error' });
    });

    // When
    await testApp.request('/test/error');

    // Then
    const [, context] = mockCaptureException.mock.calls[0];
    expect(context.tags.type).toBe('http_exception');
    expect(context.tags.status).toBe('500');
    expect(context.tags.path).toBe('/test/error');
    expect(context.tags.method).toBe('GET');
  });

  test('returns 404 status and error message for HTTPException with status < 500', async () => {
    // Given
    const { testApp } = setupTest();
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
  });

  test('adds warning breadcrumb but does not capture HTTPException with status < 500', async () => {
    // Given
    const { testApp, mockCaptureException, mockAddBreadcrumb } = setupTest();
    testApp.get('/test/not-found', () => {
      throw new HTTPException(404, { message: 'Not Found' });
    });

    // When
    await testApp.request('/test/not-found');

    // Then
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

  test('returns 500 status for regular Error', async () => {
    // Given
    const { testApp } = setupTest();
    testApp.get('/test/error', () => {
      throw new Error('Something went wrong');
    });

    // When
    const res = await testApp.request('/test/error');
    const text = await res.text();
    const data: { success: boolean; message: string } = text ? JSON.parse(text) : {};

    // Then
    expect(res.status).toBe(500);
    expect(data).toEqual({
      success: false,
      message: 'Internal Server Error',
    });
  });

  test('captures regular Error to Sentry', async () => {
    // Given
    const { testApp, mockCaptureException } = setupTest();
    testApp.get('/test/error', () => {
      throw new Error('Something went wrong');
    });

    // When
    await testApp.request('/test/error');

    // Then
    expect(mockCaptureException).toHaveBeenCalled();
    const [error] = mockCaptureException.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
  });

  test('captures regular Error with context tags', async () => {
    // Given
    const { testApp, mockCaptureException } = setupTest();
    testApp.get('/test/error', () => {
      throw new Error('Something went wrong');
    });

    // When
    await testApp.request('/test/error');

    // Then
    const [, context] = mockCaptureException.mock.calls[0];
    expect(context.tags.type).toBe('unhandled_error');
    expect(context.tags.path).toBe('/test/error');
    expect(context.tags.method).toBe('GET');
  });

  test('captures regular Error with extra context', async () => {
    // Given
    const { testApp, mockCaptureException } = setupTest();
    testApp.get('/test/error', () => {
      throw new Error('Something went wrong');
    });

    // When
    await testApp.request('/test/error', {
      headers: {
        'user-agent': 'Test User Agent',
        referer: 'https://example.com',
      },
    });

    // Then
    const [, context] = mockCaptureException.mock.calls[0];
    expect(context.extra.userAgent).toBe('Test User Agent');
    expect(context.extra.referer).toBe('https://example.com');
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
    const mockContext: MockContext = {
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
