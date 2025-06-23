import { Hono } from 'hono';
import { mockRateLimit } from '../middleware/rateLimit';
import { validateLikeRequest, validateEntryId, LikeRequestSchema } from '../middleware/validation';
import { logRequest } from '../utils/logger';
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
  const startTime = Date.now();
  
  try {
    // バリデーション済みデータを取得
    const entryId = c.get('validatedEntryId');
    const body = c.get('validatedBody');
    
    // 一時的にモックレスポンスを返す
    const mockTotal = Math.floor(Math.random() * 100) + body.counts;
    
    const response: LikeResponse = {
      success: true,
      total: mockTotal
    };

    // リクエストログを記録
    logRequest('POST', `/api/likes/${entryId}`, 200, Date.now() - startTime);

    return c.json(response);
  } catch (error) {
    // エラーはグローバルハンドラーで処理される
    throw error;
  }
});

// GET /api/likes/:entryId - いいね数取得
app.get('/:entryId', validateEntryId, async (c) => {
  const startTime = Date.now();
  
  try {
    // バリデーション済みデータを取得
    const entryId = c.get('validatedEntryId');
    
    // 一時的にモックデータを返す
    const mockCount = Math.floor(Math.random() * 100);
    
    // リクエストログを記録
    logRequest('GET', `/api/likes/${entryId}`, 200, Date.now() - startTime);
    
    return c.json({ counts: mockCount });
  } catch (error) {
    // エラーはグローバルハンドラーで処理される
    throw error;
  }
});

export default app;