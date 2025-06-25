// Cloudflare Workers environment mock
import { vi } from 'vitest';

// cloudflare:workers module mock
vi.mock('cloudflare:workers', () => ({
  default: {},
}));

// @hono-rate-limiter/cloudflare module mock
vi.mock('@hono-rate-limiter/cloudflare', () => ({
  // No-op middleware
  cloudflareRateLimiter: () => {
    return async (_: unknown, next: () => Promise<void>) => {
      await next();
    };
  },
}));

// Cloudflare global variable mock (optional)
global.fetch = global.fetch || vi.fn();
