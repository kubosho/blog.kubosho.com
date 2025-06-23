import { Hono } from 'hono';

import likesRoute from './routes/likes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = new Hono();

// Apply global error handler
app.use('*', errorHandler);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Add likes feature route
app.route('/api/likes', likesRoute);

// Apply 404 handler
app.notFound(notFoundHandler);

export default app;
