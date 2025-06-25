import pino from 'pino';

// Logger configuration for Cloudflare Workers environment
export const logger = pino({
  level: 'info',
  browser: {
    asObject: true,
  },
  base: {
    env: 'cloudflare-workers',
    service: 'likes-api',
  },
});

// Log level definitions
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// Helper function for error logging
export const logError = (error: Error, context?: Record<string, unknown>): void => {
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  });
};

// Helper function for request logging
export const logRequest = (method: string, path: string, status: number, duration?: number): void => {
  logger.info({
    request: {
      method,
      path,
      status,
      duration,
    },
  });
};
