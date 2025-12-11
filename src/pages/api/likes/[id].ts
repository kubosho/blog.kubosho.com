import type { APIContext } from 'astro';
import { DrizzleQueryError } from 'drizzle-orm';
import { parse, ValiError } from 'valibot';

import { getLikeCounts, upsertLikeCounts } from '../../../features/likes/api/likeActions';
import { likesRequestSchema } from '../../../features/likes/api/likesApiValidationSchema';

export const prerender = false;

export async function GET({ locals, params }: APIContext): Promise<Response> {
  const { id } = params;

  if (id == null || id === '') {
    return new Response(
      JSON.stringify({
        error: 'Invalid Entry ID',
        details: null,
      }),
      { status: 400 },
    );
  }

  try {
    const counts = await getLikeCounts({
      context: locals,
      entryId: id,
    });

    return new Response(
      JSON.stringify({
        id,
        counts,
      }),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          details: error.cause,
        }),
        { status: 500 },
      );
    }

    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: error.message,
          details: error.cause,
        }),
        { status: 500 },
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

export async function POST({ locals, params, request }: APIContext): Promise<Response> {
  const { id } = params;

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

  try {
    const requestBody = await request.json();
    const validatedData = parse(likesRequestSchema, requestBody);
    const counts = validatedData.counts;

    await upsertLikeCounts({
      context: locals,
      counts,
      entryId: id,
    });

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
          details: error.issues.map((issue: { path?: Array<{ key?: string }>; message: string }) => ({
            path: issue.path?.map((p) => p.key ?? '').join('.') ?? '',
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
