import type { Context, Next } from 'hono';
import * as v from 'valibot';

// Honoのコンテキスト型を拡張
type Variables = {
  validatedBody: v.InferOutput<typeof LikeRequestSchema>;
  validatedEntryId: string;
};

// いいねリクエストのスキーマ定義
export const LikeRequestSchema = v.object({
  counts: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1, 'counts must be at least 1'),
    v.maxValue(100, 'counts must not exceed 100 per request'),
  ),
});

// パスパラメータのスキーマ定義
export const EntryIdSchema = v.pipe(
  v.string(),
  v.minLength(1, 'entryId cannot be empty'),
  v.maxLength(255, 'entryId is too long'),
  v.regex(/^[a-zA-Z0-9._-]+$/, 'entryId contains invalid characters'),
);

// Validation middleware for request body
export const validateLikeRequest = async (
  c: Context<{ Variables: Variables }>,
  next: Next,
): Promise<Response | void> => {
  try {
    const body = await c.req.json();
    const validatedData = v.parse(LikeRequestSchema, body);

    // Save validated data to context
    c.set('validatedBody', validatedData);
    await next();
  } catch (error) {
    if (error instanceof v.ValiError) {
      return c.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            path: issue.path?.map((p: { key?: string }) => p.key).join('.'),
            message: issue.message,
          })),
        },
        400,
      );
    }

    return c.json({ success: false, error: 'Invalid request format' }, 400);
  }
};

// Validation middleware for path parameters
export const validateEntryId = async (c: Context<{ Variables: Variables }>, next: Next): Promise<Response | void> => {
  try {
    const entryId = c.req.param('entryId');
    const validatedEntryId = v.parse(EntryIdSchema, entryId);

    // Save validated data to context
    c.set('validatedEntryId', validatedEntryId);
    await next();
  } catch (error) {
    if (error instanceof v.ValiError) {
      return c.json(
        {
          success: false,
          error: 'Invalid entry ID',
          details: error.issues.map((issue) => ({
            message: issue.message,
          })),
        },
        400,
      );
    }

    return c.json({ success: false, error: 'Invalid entry ID format' }, 400);
  }
};
