import type { MiddlewareHandler } from 'hono';

export const cors = (options?: {
  origin?: string;
  allowMethods?: string[];
  allowHeaders?: string[];
  maxAge?: number;
}): MiddlewareHandler => {
  const defaultOptions = {
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 3600,
  };

  const config = { ...defaultOptions, ...options };

  return async (c, next) => {
    // Set CORS headers
    c.header('Access-Control-Allow-Origin', config.origin);
    c.header('Access-Control-Allow-Methods', config.allowMethods.join(','));
    c.header('Access-Control-Allow-Headers', config.allowHeaders.join(','));
    c.header('Access-Control-Max-Age', config.maxAge.toString());

    // Handle preflight requests
    if (c.req.method === 'OPTIONS') {
      return c.text('', 200);
    }

    await next();
  };
};
