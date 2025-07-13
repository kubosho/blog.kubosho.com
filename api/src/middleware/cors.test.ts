import { Hono } from 'hono';
import { describe, expect, test } from 'vitest';

import type { ApiEnv } from '../index';
import { cors } from './cors';

const setupTest = (): {
  api: Hono<ApiEnv>;
} => {
  const api = new Hono<ApiEnv>();

  api.use('*', cors());

  api.get('/test', (c) => {
    return c.json({ message: 'test' });
  });

  return { api };
};

describe('CORS middleware', () => {
  test('adds CORS headers to responses', async () => {
    // Given
    const { api } = setupTest();
    const expected = {
      origin: '*',
      methods: 'GET,POST,OPTIONS',
      headers: 'Content-Type',
    };

    // When
    const res = await api.request('/test');

    // Then
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(expected.origin);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe(expected.methods);
    expect(res.headers.get('Access-Control-Allow-Headers')).toBe(expected.headers);
  });

  test('handles OPTIONS preflight requests with 200 status', async () => {
    // Given
    const { api } = setupTest();
    const expected = 200;

    // When
    const res = await api.request('/test', {
      method: 'OPTIONS',
    });

    // Then
    expect(res.status).toBe(expected);
  });

  test('OPTIONS requests include all CORS headers', async () => {
    // Given
    const { api } = setupTest();
    const expected = {
      origin: '*',
      methods: 'GET,POST,OPTIONS',
      headers: 'Content-Type',
    };

    // When
    const res = await api.request('/test', {
      method: 'OPTIONS',
    });

    // Then
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(expected.origin);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe(expected.methods);
    expect(res.headers.get('Access-Control-Allow-Headers')).toBe(expected.headers);
  });
});
