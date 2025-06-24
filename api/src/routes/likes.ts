import { Hono, type Context } from 'hono';
import { createRateLimit, createBurstProtection, createGlobalProtection } from '../middleware/rateLimit';
import { validateEntryId, LikeRequestSchema } from '../middleware/validation';
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

// Helper function to parse request body (JSON or FormData)
const parseRequestBody = async (c: Context) => {
  const contentType = c.req.header('content-type');

  if (contentType?.includes('multipart/form-data') || !contentType?.includes('application/json')) {
    try {
      // Handle FormData from sendBeacon
      const formData = await c.req.formData();
      const counts = formData.get('counts');
      return { counts: counts !== null ? parseInt(counts.toString(), 10) : 1 };
    } catch (error) {
      // If FormData parsing fails, try JSON
      return await c.req.json();
    }
  } else {
    // Handle JSON requests
    return await c.req.json();
  }
};

// POST /api/likes/:entryId - Submit like (supports both JSON and FormData)
app.post('/:entryId', validateEntryId, async (c) => {
  const startTime = Date.now();

  try {
    // Get validated entry ID
    const entryId = c.get('validatedEntryId');

    // Parse request body (supports both JSON and FormData)
    const body = await parseRequestBody(c);

    // Validate counts value using valibot
    const counts = body.counts ?? 1;
    try {
      v.parse(v.pipe(
        v.number(),
        v.integer(),
        v.minValue(1, 'counts must be at least 1'),
        v.maxValue(100, 'counts must not exceed 100 per request')
      ), counts);
    } catch (error) {
      if (error instanceof v.ValiError) {
        return c.json({
          success: false,
          error: 'Validation failed',
          details: error.issues.map(issue => ({
            message: issue.message
          }))
        }, 400);
      }
      return c.json({ success: false, error: 'Invalid counts value' }, 400);
    }

    // Get database URL from environment (falls back to mock if not available)
    const databaseUrl = c.env?.DATABASE_URL;
    const likeService = createLikeService(databaseUrl);

    // Add likes to database
    const total = await likeService.addLikes(entryId, counts);

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
