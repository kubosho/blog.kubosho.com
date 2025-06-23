import { Hono } from 'hono';

import likesRoute from './routes/likes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = new Hono();

// グローバルエラーハンドラーを適用
app.use('*', errorHandler);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// いいね機能のルートを追加
app.route('/api/likes', likesRoute);

// 404ハンドラーを適用
app.notFound(notFoundHandler);

export default app;
