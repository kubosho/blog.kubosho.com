import { Hono } from 'hono';
import { createRateLimit, createBurstProtection, createGlobalProtection } from '../middleware/rateLimit';
import { validateLikeRequest, validateEntryId, LikeRequestSchema } from '../middleware/validation';
import { logRequest } from '../utils/logger';
import { createLikeService } from '../db/connection';
import * as v from 'valibot';

// Type definition for Hono app
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

// POST /api/likes/:entryId - Submit like
app.post('/:entryId', validateEntryId, validateLikeRequest, async (c) => {
  const startTime = Date.now();
  
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

    // Log request
    logRequest('POST', `/api/likes/${entryId}`, 200, Date.now() - startTime);

    return c.json(response);
  } catch (error) {
    // Errors are handled by global handler
    throw error;
  }
});

// GET /api/likes/:entryId - Get like count
app.get('/:entryId', validateEntryId, async (c) => {
  const startTime = Date.now();
  
  try {
    // Get validated data
    const entryId = c.get('validatedEntryId');
    
    // Get database URL from environment (falls back to mock if not available)
    const databaseUrl = c.env?.DATABASE_URL;
    const likeService = createLikeService(databaseUrl);
    
    // Get current like count
    const counts = await likeService.getLikeCount(entryId);
    
    // Log request
    logRequest('GET', `/api/likes/${entryId}`, 200, Date.now() - startTime);
    
    return c.json({ counts });
  } catch (error) {
    // Errors are handled by global handler
    throw error;
  }
});

export default app;