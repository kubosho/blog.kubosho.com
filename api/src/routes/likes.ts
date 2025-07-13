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

export default likes;
