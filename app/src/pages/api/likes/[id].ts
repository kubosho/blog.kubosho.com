import type { Cache, Response as CFResponse } from '@cloudflare/workers-types/experimental';
import type { APIContext } from 'astro';
import { parse, ValiError } from 'valibot';

import { createClientErrorResponse } from '../../../features/likes/api/createClientErrorResponse';
import { createServerErrorResponse } from '../../../features/likes/api/createServerErrorResponse';
import { getLikeCounts, incrementLikeCounts } from '../../../features/likes/api/likeActions';
import { likesOnPostRequestSchema } from '../../../features/likes/api/likesApiValidationSchema';
import { checkRateLimit } from '../../../features/likes/utils/rateLimiter';

export const prerender = false;

const COOLDOWN_PERIOD_SECONDS = 30;

function getCache({ locals }: Pick<APIContext, 'locals'>): Cache | null {
  const cache = locals.runtime?.caches?.default ?? null;
  return cache;
}

function createNormalizedCacheKey(request: Request): string {
  const url = new URL(request.url);
  url.search = '';
  return url.toString();
}

function isValidEntryId(id: string | undefined): id is string {
  return id != null && id !== '';
}

export async function GET({ locals, params, request }: APIContext): Promise<Response> {
  const { id } = params;
  if (!isValidEntryId(id)) {
    return createClientErrorResponse({ type: 'invalidEntryId' });
  }

  const cache = getCache({ locals });
  const cacheKey = createNormalizedCacheKey(request);

  const cachedResponse = await cache?.match(cacheKey);
  if (cachedResponse != null) {
    const body = await cachedResponse.text();
    return new Response(body, {
      status: cachedResponse.status,
      headers: cachedResponse.headers,
    });
  }

  try {
    const counts = await getLikeCounts({
      context: locals,
      entryId: id,
    });

    const response = new Response(
      JSON.stringify({
        id,
        counts,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    await cache?.put(cacheKey, response.clone() as CFResponse);

    return response;
  } catch (error) {
    return createServerErrorResponse({ error });
  }
}

export async function POST({ locals, params, request }: APIContext): Promise<Response> {
  const { id } = params;
  if (!isValidEntryId(id)) {
    return createClientErrorResponse({ type: 'invalidEntryId' });
  }

  if (request.body == null) {
    return createClientErrorResponse({ type: 'invalidRequestBody' });
  }

  const rateLimiterEnv = locals.runtime?.env?.LIKES_RATE_LIMITER;
  if (rateLimiterEnv != null) {
    const isRateLimitExceeded = await checkRateLimit({
      entryId: id,
      rateLimiter: rateLimiterEnv,
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

    await incrementLikeCounts({
      context: locals,
      increment,
      entryId: id,
    });

    const cache = getCache({ locals });
    const cacheKey = createNormalizedCacheKey(request);

    await cache?.delete(cacheKey);

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
