import type { RateLimit } from '@cloudflare/workers-types/experimental';

type Params = {
  clientIp: string;
  entryId: string;
  rateLimiter: RateLimit;
};

/**
 * Checks the rate limit and returns true if the limit is exceeded.
 * Returns false if the limit has not been exceeded.
 *
 * Uses a combination of client IP and entry ID as the rate limit key
 * to prevent abuse while allowing different users to like the same entry.
 *
 * @param params - The parameters including rate limiter instance, client IP, and entry ID
 * @returns true if rate limit is exceeded, false otherwise
 */
export async function checkRateLimit({ clientIp, entryId, rateLimiter }: Params): Promise<boolean> {
  try {
    const rateLimitKey = `${clientIp}:${entryId}`;
    const { success } = await rateLimiter.limit({ key: rateLimitKey });
    return !success;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Allow the request if rate limit check fails (fail open)
    return false;
  }
}
