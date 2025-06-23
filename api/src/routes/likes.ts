import { Hono } from 'hono';
import { mockRateLimit } from '../middleware/rateLimit';
import { validateLikeRequest, validateEntryId, LikeRequestSchema } from '../middleware/validation';
import * as v from 'valibot';

// Honoアプリの型定義
type Variables = {
  validatedBody: v.InferOutput<typeof LikeRequestSchema>;
  validatedEntryId: string;
};

const app = new Hono<{ Variables: Variables }>();

// 一時的にモックレート制限を適用（本格実装時はCloudflareバインディング設定後に置き換え）
app.use('*', mockRateLimit);

interface LikeResponse {
  success: boolean;
  total?: number;
}

// POST /api/likes/:entryId - いいね送信
app.post('/:entryId', validateEntryId, validateLikeRequest, async (c) => {
  // バリデーション済みデータを取得
  const entryId = c.get('validatedEntryId');
  const body = c.get('validatedBody');
  
  // 一時的にモックレスポンスを返す
  const mockTotal = Math.floor(Math.random() * 100) + body.counts;
  
  const response: LikeResponse = {
    success: true,
    total: mockTotal
  };

  return c.json(response);
});

// GET /api/likes/:entryId - いいね数取得
app.get('/:entryId', validateEntryId, async (c) => {
  // バリデーション済みデータを取得
  const entryId = c.get('validatedEntryId');
  
  // 一時的にモックデータを返す
  const mockCount = Math.floor(Math.random() * 100);
  
  return c.json({ counts: mockCount });
});

export default app;