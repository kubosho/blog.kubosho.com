import { Hono } from 'hono';
import { parse, ValiError } from 'valibot';

import type { ApiEnv } from '../index';
import { LikeService, MockLikeService } from '../services/likeService';
import { addLikesSchema } from '../validation/schemas';

const likes = new Hono<ApiEnv>();

likes.get('/api/likes/:entryId', async (c) => {
  const entryId = c.req.param('entryId');
  const databaseUrl = c.env?.DATABASE_URL;

  const likeService = databaseUrl ? new LikeService(databaseUrl) : new MockLikeService();

  const counts = await likeService.getLikeCount(entryId);

  return c.json({ counts });
});

likes.post('/api/likes/:entryId', async (c) => {
  const entryId = c.req.param('entryId');
  const databaseUrl = c.env?.DATABASE_URL;

  try {
    const body = await c.req.json();
    const validatedData = parse(addLikesSchema, body);
    const count = validatedData.counts;

    const likeService = databaseUrl ? new LikeService(databaseUrl) : new MockLikeService();

    const total = await likeService.addLikes(entryId, count);

    return c.json({
      success: true,
      total,
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
    throw error;
  }
});

export default likes;
