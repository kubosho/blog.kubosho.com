import type { RateLimit } from '@cloudflare/workers-types/experimental';

type Params = {
  entryId: string;
  rateLimiter: RateLimit;
};

/**
 * Checks the rate limit and returns true if the limit is exceeded.
 * Returns false if the limit has not been exceeded.
 *
 * @param params - The parameters including rate limiter instance and entry ID
 * @returns true if rate limit is exceeded, false otherwise
 */
export async function checkRateLimit({ entryId, rateLimiter }: Params): Promise<boolean> {
  try {
    const { success } = await rateLimiter.limit({ key: entryId });
    return !success;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Allow the request if rate limit check fails (fail open)
    return false;
  }
}
