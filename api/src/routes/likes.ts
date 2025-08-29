import { Hono } from 'hono';
import { parse, ValiError } from 'valibot';

import type { ApiEnv } from '../index';
import { LikeService, MockLikeService } from '../services/likeService';
import { addLikesSchema } from '../validation/schemas';

const likes = new Hono<ApiEnv>();

likes.get('/api/likes/:entryId', async (c) => {
  const entryId = c.req.param('entryId');
  const databaseUrl = c.env?.DATABASE_URL ?? '';
  const likeService = databaseUrl !== '' ? new LikeService(databaseUrl) : new MockLikeService();
  const counts = await likeService.getLikeCount(entryId);

  return c.json({ counts });
});

likes.post('/api/likes/:entryId', async (c) => {
  const entryId = c.req.param('entryId');
  const databaseUrl = c.env?.DATABASE_URL ?? '';

  let responseBody = null;
  try {
    responseBody = await c.req.json();
  } catch (error) {
    console.error('JSON parse error:', error);
    return c.json(
      {
        error: 'Invalid JSON',
        message: 'Request body must be valid JSON format',
      },
      400,
    );
  }

  try {
    const validatedData = parse(addLikesSchema, responseBody);

    const likeService = databaseUrl !== '' ? new LikeService(databaseUrl) : new MockLikeService();
    const counts = await likeService.addLikes(entryId, validatedData.counts);

    return c.json({
      success: true,
      counts,
    });
  } catch (error) {
    if (error instanceof ValiError) {
      return c.json(
        {
          error: 'Validation error',
          details: error.issues.map((issue) => ({
            path: issue.path?.map((p: { key?: string }) => p.key).join('.'),
            message: issue.message,
          })),
        },
        400,
      );
    }

    console.error('Unexpected error:', error);
    return c.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      500,
    );
  }
});

export default likes;
