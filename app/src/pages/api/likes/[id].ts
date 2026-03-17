import type {
  CacheStorage as CFCacheStorage,
  RateLimit,
  Response as CFResponse,
} from '@cloudflare/workers-types/experimental';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { parse, ValiError } from 'valibot';

import { createClientErrorResponse } from '../../../features/likes/api/createClientErrorResponse';
import { createServerErrorResponse } from '../../../features/likes/api/createServerErrorResponse';
import { getLikeCounts, incrementLikeCounts } from '../../../features/likes/api/likeActions';
import { likesOnPostRequestSchema } from '../../../features/likes/api/likesApiValidationSchema';
import { entryExists, type GetEntryFn } from '../../../features/likes/utils/entryExistence';
import { isValidEntryIdFormat } from '../../../features/likes/utils/entryValidator';
import { getClientIp } from '../../../features/likes/utils/getClientIp';
import { checkRateLimit } from '../../../features/likes/utils/rateLimiter';

export const prerender = false;

const COOLDOWN_PERIOD_SECONDS = 30;
const EDGE_CACHE_TTL_SECONDS = 60;

type CloudflareEnv = {
  DATABASE_URL?: string;
  HYPERDRIVE?: { connectionString: string };
  LIKES_RATE_LIMITER?: RateLimit;
};

async function getCloudflareEnv(): Promise<CloudflareEnv> {
  const { env } = await import('cloudflare:workers');
  const cfEnv = env as unknown as CloudflareEnv;
  console.log('[getCloudflareEnv] keys:', Object.keys(env as unknown as Record<string, unknown>));
  console.log('[getCloudflareEnv] has HYPERDRIVE:', 'HYPERDRIVE' in (env as unknown as Record<string, unknown>));
  return cfEnv;
}

function createNormalizedCacheKey(request: Request): string {
  const url = new URL(request.url);
  url.search = '';
  return url.toString();
}

export async function GET({ params, request }: APIContext): Promise<Response> {
  const { id } = params;
  if (!isValidEntryIdFormat(id)) {
    return createClientErrorResponse({ type: 'invalidEntryId' });
  }

  try {
    const exists = await entryExists(id, getEntry as GetEntryFn);
    if (!exists) {
      return createClientErrorResponse({ type: 'entryNotFound' });
    }
  } catch (error) {
    return createServerErrorResponse({ error });
  }

  const cache = (caches as unknown as CFCacheStorage).default;
  const cacheKey = createNormalizedCacheKey(request);

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse != null) {
    const body = await cachedResponse.text();
    return new Response(body, {
      status: cachedResponse.status,
      headers: cachedResponse.headers,
    });
  }

  let dbSource = 'unknown';
  try {
    const cfEnv = await getCloudflareEnv();
    dbSource = cfEnv.HYPERDRIVE?.connectionString ? 'hyperdrive' : cfEnv.DATABASE_URL ? 'env' : 'process.env';
    const counts = await getLikeCounts({ entryId: id, env: cfEnv });

    const response = new Response(
      JSON.stringify({
        id,
        counts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=0, s-maxage=${EDGE_CACHE_TTL_SECONDS}`,
        },
      },
    );

    await cache.put(cacheKey, response.clone() as CFResponse);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ message, dbSource }), { status: 500 });
  }
}

export async function POST({ params, request }: APIContext): Promise<Response> {
  const { id } = params;
  if (!isValidEntryIdFormat(id)) {
    return createClientErrorResponse({ type: 'invalidEntryId' });
  }

  try {
    const exists = await entryExists(id, getEntry as GetEntryFn);
    if (!exists) {
      return createClientErrorResponse({ type: 'entryNotFound' });
    }
  } catch (error) {
    return createServerErrorResponse({ error });
  }

  if (request.body == null) {
    return createClientErrorResponse({ type: 'invalidRequestBody' });
  }

  const cfEnv = await getCloudflareEnv();

  if (cfEnv.LIKES_RATE_LIMITER != null) {
    const clientIp = getClientIp(request);
    const isRateLimitExceeded = await checkRateLimit({
      clientIp,
      entryId: id,
      rateLimiter: cfEnv.LIKES_RATE_LIMITER,
    });

    if (isRateLimitExceeded) {
      return createClientErrorResponse({ type: 'rateLimit', cooldownSeconds: COOLDOWN_PERIOD_SECONDS });
    }
  }

  try {
    const requestBody = await request.json();
    const validatedData = parse(likesOnPostRequestSchema, requestBody);
    const increment = validatedData.increment;
    if (increment < 0) {
      return createClientErrorResponse({ type: 'invalidIncrement' });
    }

    await incrementLikeCounts({ entryId: id, increment, env: cfEnv });

    const cache = (caches as unknown as CFCacheStorage).default;
    const cacheKey = createNormalizedCacheKey(request);

    await cache.delete(cacheKey);

    return new Response(
      JSON.stringify({
        message: 'OK',
      }),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ValiError) {
      return createClientErrorResponse({ type: 'validationError', error });
    }

    return createServerErrorResponse({ error });
  }
}
