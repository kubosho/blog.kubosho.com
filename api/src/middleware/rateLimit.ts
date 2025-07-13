import type { MiddlewareHandler } from 'hono';

import type { ApiEnv } from '../index';

export const rateLimit = (): MiddlewareHandler<ApiEnv> => {
  return async (c, next) => {
    const rateLimiter = c.env?.RATE_LIMITER;

    // If rate limiter is not configured, pass through
    if (!rateLimiter) {
      await next();
      return;
    }

    // Get client IP from Cloudflare headers
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

    try {
      const { success } = await rateLimiter.limit({ key: ip });

      if (!success) {
        return c.json({ error: 'Too many requests' }, 429);
      }

      await next();
    } catch (error) {
      // If rate limiting fails, log error but allow request to proceed
      console.error('Rate limiting error:', error);
      await next();
    }
  };
};
