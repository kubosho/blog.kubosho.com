import { Hono } from 'hono';
import { describe, expect, test, vi } from 'vitest';

import type { ApiEnv } from '../index';
import { logging } from './logging';

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (): {
  api: Hono<ApiEnv>;
  consoleLogSpy: ReturnType<typeof vi.spyOn>;
  consoleErrorSpy: ReturnType<typeof vi.spyOn>;
} => {
  cleanupTest();

  const api = new Hono<ApiEnv>();
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  api.use('*', logging());

  return { api, consoleLogSpy, consoleErrorSpy };
};

interface LogEntry {
  level: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  userAgent?: string;
}

describe('Logging middleware', () => {
  test('returns 200 status for successful request', async () => {
    // Given
    const { api } = setupTest();
    api.get('/test', (c) => {
      return c.json({ message: 'test' }, 200);
    });

    // When
    const res = await api.request('/test');

    // Then
    expect(res.status).toBe(200);
  });

  test('logs request when called', async () => {
    // Given
    const { api, consoleLogSpy } = setupTest();
    const userAgent = 'test-agent';
    api.get('/test', (c) => {
      return c.json({ message: 'test' }, 200);
    });

    // When
    await api.request('/test', {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
      },
    });

    // Then
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  test('logs request details with correct structure', async () => {
    // Given
    const { api, consoleLogSpy } = setupTest();
    const userAgent = 'test-agent';
    api.get('/test', (c) => {
      return c.json({ message: 'test' }, 200);
    });

    // When
    await api.request('/test', {
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
      },
    });

    // Then
    const logCall = consoleLogSpy.mock.calls[0][0] as LogEntry;
    expect(logCall).toEqual({
      level: 'info',
      method: 'GET',
      path: '/test',
      status: 200,
      duration: expect.any(Number),
      userAgent: userAgent,
    });
  });

  test('returns 500 status when error is thrown', async () => {
    // Given
    const { api } = setupTest();
    const errorMessage = 'Test error';
    api.get('/error', () => {
      throw new Error(errorMessage);
    });
    api.onError((err, c) => {
      return c.json({ error: err.message }, 500);
    });

    // When
    const res = await api.request('/error');

    // Then
    expect(res.status).toBe(500);
  });

  test('logs error response when error occurs', async () => {
    // Given
    const { api, consoleLogSpy } = setupTest();
    const errorMessage = 'Test error';
    api.get('/error', () => {
      throw new Error(errorMessage);
    });
    api.onError((err, c) => {
      return c.json({ error: err.message }, 500);
    });

    // When
    await api.request('/error');

    // Then
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  test('logs error response details correctly', async () => {
    // Given
    const { api, consoleLogSpy } = setupTest();
    const errorMessage = 'Test error';
    api.get('/error', () => {
      throw new Error(errorMessage);
    });
    api.onError((err, c) => {
      return c.json({ error: err.message }, 500);
    });

    // When
    await api.request('/error');

    // Then
    const logCall = consoleLogSpy.mock.calls[0][0] as LogEntry;
    expect(logCall).toEqual({
      level: 'info',
      method: 'GET',
      path: '/error',
      status: 500,
      duration: expect.any(Number),
      userAgent: 'unknown',
    });
  });
});
