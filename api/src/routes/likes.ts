import { Hono } from 'hono';
import type { ApiEnv } from '../index';
import { LikeService, MockLikeService } from '../services/likeService';

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

  const body = await c.req.json();
  const count = body.counts || 1;

  const likeService = databaseUrl ? new LikeService(databaseUrl) : new MockLikeService();

  const total = await likeService.addLikes(entryId, count);

  return c.json({
    success: true,
    total,
  });
});

export default likes;
