import { describe, expect, it } from 'vitest';
import { Hono } from 'hono';
import type { ApiEnv } from '../index';
import { createSentryErrorTracker } from '../tracker/sentry';
import likes from './likes';

describe('GET /api/likes/:entryId', () => {
  it('should return the like count for an entry', async () => {
    const api = new Hono<ApiEnv>();
    
    // Apply error tracker middleware
    api.use('*', async (c, next) => {
      const env = (c.env ?? {}) as Record<string, string | undefined>;
      const errorTracker = createSentryErrorTracker(env);
      c.set('errorTracker', errorTracker);
      await next();
    });

    // Apply routes
    api.route('/', likes);

    const res = await api.request('/api/likes/test-entry-123');
    
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('counts');
    expect(typeof json.counts).toBe('number');
  });
});

describe('POST /api/likes/:entryId', () => {
  it('should add likes and return the new total', async () => {
    const api = new Hono<ApiEnv>();
    
    // Apply error tracker middleware
    api.use('*', async (c, next) => {
      const env = (c.env ?? {}) as Record<string, string | undefined>;
      const errorTracker = createSentryErrorTracker(env);
      c.set('errorTracker', errorTracker);
      await next();
    });

    // Apply routes
    api.route('/', likes);

    const res = await api.request('/api/likes/test-entry-456', {
      method: 'POST',
      body: JSON.stringify({ counts: 1 }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('success');
    expect(json).toHaveProperty('total');
    expect(json.success).toBe(true);
    expect(typeof json.total).toBe('number');
  });

  it('should validate request body and reject invalid counts', async () => {
    const api = new Hono<ApiEnv>();
    
    // Apply error tracker middleware
    api.use('*', async (c, next) => {
      const env = (c.env ?? {}) as Record<string, string | undefined>;
      const errorTracker = createSentryErrorTracker(env);
      c.set('errorTracker', errorTracker);
      await next();
    });

    // Apply routes
    api.route('/', likes);

    const res = await api.request('/api/likes/test-entry-789', {
      method: 'POST',
      body: JSON.stringify({ counts: -1 }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('should reject non-numeric counts', async () => {
    const api = new Hono<ApiEnv>();
    
    // Apply error tracker middleware
    api.use('*', async (c, next) => {
      const env = (c.env ?? {}) as Record<string, string | undefined>;
      const errorTracker = createSentryErrorTracker(env);
      c.set('errorTracker', errorTracker);
      await next();
    });

    // Apply routes
    api.route('/', likes);

    const res = await api.request('/api/likes/test-entry-999', {
      method: 'POST',
      body: JSON.stringify({ counts: 'invalid' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });
});