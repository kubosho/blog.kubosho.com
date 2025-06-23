import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import type { Context, Env, MiddlewareHandler } from 'hono';

// Cloudflare Workers環境用のレート制限設定
// 注意: 実際の使用時にはCloudflare Rate Limiting APIのバインディングが必要
export const createRateLimiters = () => {
  // 基本的なレート制限（IP基準）
  const basicLimiter = cloudflareRateLimiter({
    rateLimitBinding: (c: Context) => {
      // 実際の環境では c.env.RATE_LIMITER のようなバインディングを使用
      // 現在はモック実装として undefined を返す
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

// 一時的なモック実装（Cloudflareバインディング未設定時）
export const mockRateLimit = async (c: Context, next: () => Promise<void>) => {
  // 開発環境では制限を適用しない
  await next();
};