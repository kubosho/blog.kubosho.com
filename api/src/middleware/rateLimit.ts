import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import type { Context, Env, MiddlewareHandler } from 'hono';

// Rate limiting configuration for Cloudflare Workers environment
// Note: Cloudflare Rate Limiting API bindings are required for production use
export const createRateLimiters = () => {
  // Basic rate limiting (IP-based)
  const basicLimiter = cloudflareRateLimiter({
    rateLimitBinding: (c: Context) => {
      // In production, use bindings like c.env.RATE_LIMITER
      // Currently returns undefined as mock implementation
      return undefined as any;
    },
    keyGenerator: (c: Context) => {
      const ip = c.req.header('cf-connecting-ip') || 
                 c.req.header('x-forwarded-for') || 
                 c.req.header('x-real-ip') || 
                 'unknown';
      return ip;
    }
  });

  return {
    basicLimiter
  };
};

// Temporary mock implementation (when Cloudflare bindings are not configured)
export const mockRateLimit = async (c: Context, next: () => Promise<void>) => {
  // No rate limiting in development environment
  await next();
};