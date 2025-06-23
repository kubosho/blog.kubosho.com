import { Hono } from 'hono';
import { mockRateLimit } from '../middleware/rateLimit';

const app = new Hono();

// 一時的にモックレート制限を適用（本格実装時はCloudflareバインディング設定後に置き換え）
app.use('*', mockRateLimit);

interface LikeRequest {
  counts: number;
}

interface LikeResponse {
  success: boolean;
  total?: number;
}

// POST /api/likes/:entryId - いいね送信
app.post('/:entryId', async (c) => {
  const entryId = c.req.param('entryId');
  
  // リクエストボディの取得とパース
  let body: LikeRequest;
  try {
    body = await c.req.json();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid JSON' }, 400);
  }

  // 一時的にモックレスポンスを返す
  const mockTotal = Math.floor(Math.random() * 100) + body.counts;
  
  const response: LikeResponse = {
    success: true,
    total: mockTotal
  };

  return c.json(response);
});

// GET /api/likes/:entryId - いいね数取得
app.get('/:entryId', async (c) => {
  const entryId = c.req.param('entryId');
  
  // 一時的にモックデータを返す
  const mockCount = Math.floor(Math.random() * 100);
  
  return c.json({ counts: mockCount });
});

export default app;