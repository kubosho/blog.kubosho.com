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