import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import type { Context, Env, MiddlewareHandler } from 'hono';

// Rate limiting configuration for production Cloudflare Workers environment
export const createProductionRateLimit = (): ReturnType<typeof cloudflareRateLimiter> => {
  return cloudflareRateLimiter({
    rateLimitBinding: (c: Context) => {
      return c.env?.RATE_LIMITER;
    },
    keyGenerator: (c: Context) => {
      const ip =
        c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
      return ip;
    },
    message: 'Too many requests, please slow down',
  });
};

// Burst protection (short-term high volume)
export const createBurstProtection = <E extends Env = Env>(): MiddlewareHandler<E> => {
  return cloudflareRateLimiter({
    rateLimitBinding: (c: Context) => c.env?.RATE_LIMITER,
    keyGenerator: (c: Context) => {
      const ip = c.req.header('cf-connecting-ip') || 'unknown';
      return `burst:${ip}`;
    },
    message: 'Burst limit exceeded',
  }) as unknown as MiddlewareHandler<E>;
};

// Global system protection
export const createGlobalProtection = <E extends Env = Env>(): MiddlewareHandler<E> => {
  return cloudflareRateLimiter({
    rateLimitBinding: (c: Context) => c.env?.RATE_LIMITER,
    keyGenerator: () => 'global',
    message: 'System is experiencing high load',
  }) as unknown as MiddlewareHandler<E>;
};

// Smart rate limiting that uses production or mock based on environment
export const createRateLimit = <E extends Env = Env>(
  env?: E['Bindings'] & { RATE_LIMITER?: string | undefined },
): MiddlewareHandler<E> => {
  if (env?.RATE_LIMITER) {
    // Production environment with Cloudflare bindings
    return createProductionRateLimit() as unknown as MiddlewareHandler<E>;
  } else {
    // Development/mock environment
    return mockRateLimit as unknown as MiddlewareHandler<E>;
  }
};

<<<<<<< HEAD
// 一時的なモック実装（Cloudflareバインディング未設定時）
export const mockRateLimit = async (c: Context, next: () => Promise<void>) => {
  // 開発環境では制限を適用しない
=======
// Temporary mock implementation (when Cloudflare bindings are not configured)
export const mockRateLimit = async <E extends Env>(_: Context<E>, next: () => Promise<void>): Promise<void> => {
  // No rate limiting in development environment
>>>>>>> 46eb4f05 (feat(api): implement production-ready rate limiting with Cloudflare)
  await next();
};
