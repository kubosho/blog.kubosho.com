import { Hono } from 'hono';
import { createRateLimit, createBurstProtection, createGlobalProtection } from '../middleware/rateLimit';
import { validateLikeRequest, validateEntryId, LikeRequestSchema } from '../middleware/validation';
import { createLikeService } from '../db/connection';
import * as v from 'valibot';

// Honoアプリの型定義
type Variables = {
  validatedBody: v.InferOutput<typeof LikeRequestSchema>;
  validatedEntryId: string;
};

const app = new Hono<{ Variables: Variables }>();

// Apply smart rate limiting (production or mock based on environment)
app.use('*', async (c, next) => {
  const rateLimiter = createRateLimit(c.env);
  return rateLimiter(c, next);
});

// Apply burst protection for high-volume scenarios
app.use('*', async (c, next) => {
  if (c.env?.RATE_LIMITER) {
    const burstProtection = createBurstProtection();
    return burstProtection(c, next);
  }
  await next();
});

// Apply global system protection
app.use('*', async (c, next) => {
  if (c.env?.RATE_LIMITER) {
    const globalProtection = createGlobalProtection();
    return globalProtection(c, next);
  }
  await next();
});

interface LikeResponse {
  success: boolean;
  total?: number;
}

// POST /api/likes/:entryId - いいね送信
app.post('/:entryId', validateEntryId, validateLikeRequest, async (c) => {
  // バリデーション済みデータを取得
  const entryId = c.get('validatedEntryId');
  const body = c.get('validatedBody');

  try {
    // Get validated data
    const entryId = c.get('validatedEntryId');
    const body = c.get('validatedBody');

    // Get database URL from environment (falls back to mock if not available)
    const databaseUrl = c.env?.DATABASE_URL;
    const likeService = createLikeService(databaseUrl);

    // Add likes to database
    const total = await likeService.addLikes(entryId, body.counts);

    const response: LikeResponse = {
      success: true,
      total
    };

  return c.json(response);
});

// GET /api/likes/:entryId - いいね数取得
app.get('/:entryId', validateEntryId, async (c) => {
  // バリデーション済みデータを取得
  const entryId = c.get('validatedEntryId');

  try {
    // Get validated data
    const entryId = c.get('validatedEntryId');

    // Get database URL from environment (falls back to mock if not available)
    const databaseUrl = c.env?.DATABASE_URL;
    const likeService = createLikeService(databaseUrl);

    // Get current like count
    const counts = await likeService.getLikeCount(entryId);

    return c.json({ counts });
  } catch (error) {
    // Errors are handled by global handler
    throw error;
  }
});

export default app;
