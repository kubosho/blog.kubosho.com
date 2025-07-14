import type { MiddlewareHandler } from 'hono';

export const logging = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = Date.now();
    const method = c.req.method;
    const path = c.req.path;
    const userAgent = c.req.header('User-Agent') || 'unknown';

    try {
      await next();

      const duration = Date.now() - start;
      const status = c.res.status;

      // Log successful requests
      console.log({
        level: 'info',
        method,
        path,
        status,
        duration,
        userAgent,
      });
    } catch (error) {
      const duration = Date.now() - start;

      // Log errors
      console.error({
        level: 'error',
        method,
        path,
        status: 500,
        duration,
        userAgent,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  };
};
