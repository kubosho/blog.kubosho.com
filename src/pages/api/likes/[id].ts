import type { APIContext } from 'astro';
import { DrizzleQueryError } from 'drizzle-orm';
import { parse, ValiError } from 'valibot';

import { likesRequestSchema } from '../../../features/likes/api/likesApiValidationSchema';
import { LikeService } from '../../../features/likes/api/likeService';
import { isPreview, isProduction } from '../../../utils/runtimeEnvironment';

export const prerender = false;

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const { id } = params;
  const env = locals.runtime?.env;
  const databaseUrlEnv = locals.runtime?.env.DATABASE_URL;
  const databaseUrl =
    env?.HYPERDRIVE.connectionString != null && env.HYPERDRIVE.connectionString !== ''
      ? env.HYPERDRIVE.connectionString
      : databaseUrlEnv;

  if (id == null || id === '') {
    return new Response(
      JSON.stringify({
        error: 'Invalid Entry ID',
        details: null,
      }),
      { status: 400 },
    );
  }

  if (databaseUrl == null || databaseUrl === '') {
    return new Response(
      JSON.stringify({
        error: 'Database URL is not defined',
        details: null,
      }),
      { status: 500 },
    );
  }

  const likeService = new LikeService(databaseUrl);
  const counts = await likeService.getLikeCount(id);

  return new Response(
    JSON.stringify({
      id,
      counts,
    }),
    { status: 200 },
  );
}

export async function POST({ locals, params, request }: APIContext): Promise<Response> {
  const { id } = params;
  const env = locals.runtime?.env;
  const databaseUrlEnv = locals.runtime?.env.DATABASE_URL;
  const databaseUrl =
    env?.HYPERDRIVE.connectionString != null && env.HYPERDRIVE.connectionString !== ''
      ? env.HYPERDRIVE.connectionString
      : databaseUrlEnv;

  if (id == null || id === '') {
    return new Response(
      JSON.stringify({
        error: 'Invalid Entry ID',
        details: null,
      }),
      { status: 400 },
    );
  }

  if (request.body == null) {
    return new Response(
      JSON.stringify({
        error: 'Request body must be valid JSON format',
        details: null,
      }),
      { status: 400 },
    );
  }

  if (databaseUrl == null || databaseUrl === '') {
    return new Response(
      JSON.stringify({
        error: 'Database URL is not defined',
        details: null,
      }),
      { status: 500 },
    );
  }

  const rateLimiter = locals.runtime?.env.RATE_LIMITER;
  if ((isProduction() || isPreview()) && rateLimiter != null) {
    const { success } = await rateLimiter.limit({ key: id });

    if (!success) {
      return new Response(JSON.stringify({ error: 'Too Many Requests', details: null }), {
        status: 429,
      });
    }
  }

  try {
    const requestBody = await request.json();
    const validatedData = parse(likesRequestSchema, requestBody);
    const likeService = new LikeService(databaseUrl);
    const counts = await likeService.addLikes(id, validatedData.counts);

    return new Response(
      JSON.stringify({
        id,
        counts,
      }),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ValiError) {
      return new Response(
        JSON.stringify({
          error: 'Validation error',
          details: error.issues.map((issue) => ({
            path: issue.path?.map((p: { key?: string }) => p.key).join('.'),
            message: issue.message,
          })),
        }),
        { status: 400 },
      );
    }

    if (error instanceof DrizzleQueryError) {
      console.error('Database query error:', error.message, error.cause);
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: null,
      }),
      { status: 500 },
    );
  }
}
