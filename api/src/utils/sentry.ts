import * as Sentry from '@sentry/cloudflare';
import type { Context } from 'hono';

interface SentryConfig {
  dsn?: string | undefined;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
}

/**
 * Initialize Sentry for Cloudflare Workers
 */
export function initSentry(
  request: Request,
  env: Record<string, string | undefined>,
  context: Record<string, unknown>,
): void {
  const config: SentryConfig = {
    dsn: env.SENTRY_DSN,
    environment: env.ENVIRONMENT || 'development',
    release: env.RELEASE_VERSION || 'unknown',
    tracesSampleRate: env.ENVIRONMENT === 'production' ? 0.1 : 1.0,
  };

  if (!config.dsn) {
    console.warn('Sentry DSN not configured, error tracking disabled');
    return;
  }

  // @ts-expect-error Sentry.init is available in cloudflare runtime
  Sentry.init(request, context, config);
}

/**
 * Capture exception with additional context
 */
export function captureException(
  error: Error | unknown,
  context?: {
    honoContext?: Context;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
    user?: { id?: string; ip_address?: string };
  },
): void {
  if (!Sentry.getCurrentScope()) {
    console.error('Sentry not initialized', error);
    return;
  }

  Sentry.withScope((scope) => {
    // Add extra context
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    // Add tags
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Add user context
    if (context?.user) {
      scope.setUser(context.user);
    }

    // Add request context if Hono context is available
    if (context?.honoContext) {
      const c = context.honoContext;
      scope.setContext('request', {
        url: c.req.url,
        method: c.req.method,
        headers: Object.fromEntries(c.req.raw.headers.entries()),
        ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
      });
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture message with level
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info',
): void {
  if (!Sentry.getCurrentScope()) {
    console.log(`[${level}] ${message}`);
    return;
  }

  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  data?: Record<string, unknown>;
}): void {
  if (!Sentry.getCurrentScope()) {
    return;
  }

  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || 'custom',
    level: breadcrumb.level || 'info',
    ...(breadcrumb.data && { data: breadcrumb.data }),
    timestamp: Date.now() / 1000,
  });
}

/**
 * Middleware for Hono to capture errors
 */
export async function sentryMiddleware(c: Context, next: () => Promise<void>): Promise<void> {
  try {
    await next();
  } catch (error) {
    captureException(error, {
      honoContext: c,
      tags: {
        path: c.req.path,
        method: c.req.method,
      },
    });
    throw error;
  }
}
