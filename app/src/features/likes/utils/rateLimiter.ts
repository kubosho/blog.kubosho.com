import type { RateLimit } from '@cloudflare/workers-types/experimental';

type Params = {
  entryId: string;
  rateLimiter: RateLimit;
};

const COOLDOWN_PERIOD_SECONDS = 30;

/**
 * Checks the rate limit and returns an error response if exceeded.
 * Returns null if the limit has not been exceeded.
 *
 * @param params - The parameters including rate limiter instance and entry ID
 * @returns A 429 response if rate limit is exceeded, null otherwise
 */
export async function checkRateLimit({ entryId, rateLimiter }: Params): Promise<Response | null> {
  try {
    const { success } = await rateLimiter.limit({ key: entryId });
    if (!success) {
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          details: `Rate limit exceeded. Please try again in ${COOLDOWN_PERIOD_SECONDS} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': COOLDOWN_PERIOD_SECONDS.toString(),
          },
        },
      );
    }

    return null;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Allow the request if rate limit check fails (fail open)
    return null;
  }
}
