import type { APIContext } from 'astro';
import { parse, ValiError } from 'valibot';

import { LikeService } from '../../../features/likes/api/likeService';
import { likesRequestSchema } from '../../../features/likes/api/validationSchema';

export const prerender = false;

export async function GET({ params }: APIContext): Promise<Response> {
  const { id } = params;
  const databaseUrl = import.meta.env.DATABASE_URL;

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

export async function POST({ params, request }: APIContext): Promise<Response> {
  const { id } = params;
  const databaseUrl = import.meta.env.DATABASE_URL;

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

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: null,
      }),
      { status: 500 },
    );
  }
}
