import type { RateLimit } from '@cloudflare/workers-types';
import { Hono } from 'hono';
import { describe, expect, test, vi } from 'vitest';

import type { ApiEnv } from '../index';
import { rateLimit } from './rateLimit';

interface TestResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (options?: {
  rateLimiterSuccess?: boolean;
  hasRateLimiter?: boolean;
}): {
  api: Hono<ApiEnv>;
  mockRateLimiter?: RateLimit;
  testIp: string;
} => {
  cleanupTest();

  const api = new Hono<ApiEnv>();
  const testIp = '192.168.1.1';
  let mockRateLimiter: RateLimit | undefined;

  if (options?.hasRateLimiter) {
    mockRateLimiter = {
      limit: vi.fn().mockResolvedValue({ success: options.rateLimiterSuccess ?? true }),
    };

    // Set up environment with rate limiter
    api.use('*', async (c, next) => {
      c.env = {
        RATE_LIMITER: mockRateLimiter,
      };
      await next();
    });
  }

  api.use('*', rateLimit());

  api.get('/test', (c) => {
    return c.json({ message: 'test' });
  });

  return { api, mockRateLimiter, testIp };
};

describe('Rate limit middleware', () => {
  test('passes through when rate limiter is not configured', async () => {
    // Given
    const { api } = setupTest({ hasRateLimiter: false });
    const expected = {
      status: 200,
      body: { message: 'test' },
    };

    // When
    const res = await api.request('/test');
    const json = await res.json<TestResponse>();

    // Then
    expect(res.status).toBe(expected.status);
    expect(json).toEqual(expected.body);
  });

  test('checks rate limit when rate limiter is configured', async () => {
    // Given
    const { api, mockRateLimiter, testIp } = setupTest({
      hasRateLimiter: true,
      rateLimiterSuccess: true,
    });
    const expected = {
      status: 200,
      limitCallArgs: { key: testIp },
    };

    // When
    const res = await api.request('/test', {
      headers: {
        'CF-Connecting-IP': testIp,
      },
    });

    // Then
    expect(res.status).toBe(expected.status);
    expect(mockRateLimiter?.limit).toHaveBeenCalledWith(expected.limitCallArgs);
  });

  test('returns 429 when rate limit is exceeded', async () => {
    // Given
    const { api, mockRateLimiter, testIp } = setupTest({
      hasRateLimiter: true,
      rateLimiterSuccess: false,
    });
    const expected = {
      status: 429,
      error: 'Too many requests',
    };

    // When
    const res = await api.request('/test', {
      headers: {
        'CF-Connecting-IP': testIp,
      },
    });
    const json = await res.json<ErrorResponse>();

    // Then
    expect(res.status).toBe(expected.status);
    expect(json.error).toBe(expected.error);
    expect(mockRateLimiter?.limit).toHaveBeenCalled();
  });
});
