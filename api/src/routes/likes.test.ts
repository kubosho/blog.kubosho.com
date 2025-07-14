import { Hono } from 'hono';
import { describe, expect, test, vi } from 'vitest';

import type { ApiEnv } from '../index';
import { createSentryErrorTracker } from '../tracker/sentry';
import likes from './likes';

interface LikesResponse {
  counts?: number;
  success?: boolean;
  total?: number;
  error?: string;
}

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (): {
  api: Hono<ApiEnv>;
  mockEnv: Record<string, string | undefined>;
  consoleWarnSpy: ReturnType<typeof vi.spyOn>;
} => {
  cleanupTest();

  const api = new Hono<ApiEnv>();
  const mockEnv = {} as Record<string, string | undefined>;
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  api.use('*', async (c, next) => {
    const errorTracker = createSentryErrorTracker(mockEnv);
    c.set('errorTracker', errorTracker);
    await next();
  });

  api.route('/', likes);

  return { api, mockEnv, consoleWarnSpy };
};

describe('GET /api/likes/:entryId', () => {
  test('returns the like count for an entry', async () => {
    // Given
    const { api } = setupTest();
    const entryId = 'test-entry-123';
    const expected = {
      status: 200,
    };

    // When
    const res = await api.request(`/api/likes/${entryId}`);
    const json = await res.json<LikesResponse>();

    // Then
    expect(res.status).toBe(expected.status);
    expect(json).toHaveProperty('counts');
    expect(typeof json.counts).toBe('number');
  });
});

describe('POST /api/likes/:entryId', () => {
  test('adds likes and returns the new total', async () => {
    // Given
    const { api } = setupTest();
    const entryId = 'test-entry-456';
    const requestBody = { counts: 1 };
    const expected = {
      status: 200,
      success: true,
    };

    // When
    const res = await api.request(`/api/likes/${entryId}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json<LikesResponse>();

    // Then
    expect(res.status).toBe(expected.status);
    expect(json.success).toBe(expected.success);
    expect(typeof json.total).toBe('number');
  });

  test('validates request body and rejects invalid counts', async () => {
    // Given
    const { api } = setupTest();
    const entryId = 'test-entry-789';
    const invalidBody = { counts: -1 };
    const expected = {
      status: 400,
    };

    // When
    const res = await api.request(`/api/likes/${entryId}`, {
      method: 'POST',
      body: JSON.stringify(invalidBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json<LikesResponse>();

    // Then
    expect(res.status).toBe(expected.status);
    expect(json).toHaveProperty('error');
    expect(typeof json.error).toBe('string');
  });

  test('rejects non-numeric counts', async () => {
    // Given
    const { api } = setupTest();
    const entryId = 'test-entry-999';
    const invalidBody = { counts: 'invalid' };
    const expected = {
      status: 400,
    };

    // When
    const res = await api.request(`/api/likes/${entryId}`, {
      method: 'POST',
      body: JSON.stringify(invalidBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json<LikesResponse>();

    // Then
    expect(res.status).toBe(expected.status);
    expect(json).toHaveProperty('error');
    expect(typeof json.error).toBe('string');
  });
});
