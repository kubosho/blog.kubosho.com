import { Hono } from 'hono';
import { validateLikeRequest, validateEntryId, LikeRequestSchema } from '../src/middleware/validation';
import { logRequest } from '../src/utils/logger';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler';
import * as v from 'valibot';

// テスト用のアプリ（レート制限なし）
type Variables = {
  validatedBody: v.InferOutput<typeof LikeRequestSchema>;
  validatedEntryId: string;
};

const testApp = new Hono<{ Variables: Variables }>();

// グローバルエラーハンドラーを適用
testApp.use('*', errorHandler);

testApp.get('/', (c) => {
  return c.text('Hello Hono Test!');
});

interface LikeResponse {
  success: boolean;
  total?: number;
}

// POST /api/likes/:entryId - いいね送信（テスト用、レート制限なし）
testApp.post('/api/likes/:entryId', validateEntryId, validateLikeRequest, async (c) => {
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

// GET /api/likes/:entryId - いいね数取得（テスト用、レート制限なし）
testApp.get('/api/likes/:entryId', validateEntryId, async (c) => {
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

// 404ハンドラーを適用
testApp.notFound(notFoundHandler);

export default testApp;