import { Hono } from 'hono';

import likesRoute from './routes/likes';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// いいね機能のルートを追加
app.route('/api/likes', likesRoute);

export default app;
