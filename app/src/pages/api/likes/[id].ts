import type { Cache, Response as CFResponse } from '@cloudflare/workers-types/experimental';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { parse, ValiError } from 'valibot';

import { createClientErrorResponse } from '../../../features/likes/api/createClientErrorResponse';
import { createServerErrorResponse } from '../../../features/likes/api/createServerErrorResponse';
import { getLikeCounts, incrementLikeCounts } from '../../../features/likes/api/likeActions';
import { likesOnPostRequestSchema } from '../../../features/likes/api/likesApiValidationSchema';
import { entryExists, type GetEntryFn } from '../../../features/likes/utils/entryExistence';
import { isValidEntryIdFormat } from '../../../features/likes/utils/entryValidator';
import { checkRateLimit } from '../../../features/likes/utils/rateLimiter';

export const prerender = false;

const COOLDOWN_PERIOD_SECONDS = 30;
const DEFAULT_CLIENT_IP = 'unknown';

function getCache({ locals }: Pick<APIContext, 'locals'>): Cache | null {
  const cache = locals.runtime?.caches?.default ?? null;
  return cache;
}

function createNormalizedCacheKey(request: Request): string {
  const url = new URL(request.url);
  url.search = '';
  return url.toString();
}

function getClientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    DEFAULT_CLIENT_IP
  );
}

export async function GET({ locals, params, request }: APIContext): Promise<Response> {
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

  const rateLimiterEnv = locals.runtime?.env?.LIKES_RATE_LIMITER;
  if (rateLimiterEnv != null) {
    const clientIp = getClientIp(request);
    const isRateLimitExceeded = await checkRateLimit({
      clientIp,
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
