import type { Scope as SentryScope } from '@sentry/cloudflare';
import {
  addBreadcrumb as sentryAddBreadcrumb,
  captureException as sentryCaptureException,
  captureMessage as sentryCaptureMessage,
  withScope as sentryWithScope,
} from '@sentry/cloudflare';
import type { Context } from 'hono';

import { generateFingerprint, generateUniqueId } from './errorIdentityFactory';
import type { ErrorEvent, ErrorGroup, ErrorTracker } from './types';

interface SentryConfig {
  dsn?: string | undefined;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
}

function applyContextToScope(
  scope: SentryScope,
  context?: {
    honoContext?: Context;
    extra?: Record<string, unknown>;
    tags?: Record<string, string>;
    user?: { id?: string; ip_address?: string };
  },
): void {
  if (context?.extra != null) {
    Object.entries(context.extra).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
  }

  if (context?.tags != null) {
    Object.entries(context.tags).forEach(([key, value]) => {
      scope.setTag(key, value);
    });
  }

  if (context?.user != null) {
    scope.setUser(context.user);
  }

  if (context?.honoContext != null) {
    const c = context.honoContext;
    scope.setContext('request', {
      url: c.req.url,
      method: c.req.method,
      headers: Object.fromEntries([...c.req.raw.headers] as [string, string][]),
      ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
    });
  }
}

export class SentryErrorTracker implements ErrorTracker {
  private errors: Map<string, ErrorGroup> = new Map();
  private threshold = 10;
  private initialized = false;
  private config: SentryConfig;

  constructor(private env: Record<string, string | undefined>) {
    this.config = {
      dsn: this.env.SENTRY_DSN,
      environment: this.env.ENVIRONMENT || 'development',
      release: this.env.RELEASE_VERSION || 'unknown',
      tracesSampleRate: this.env.ENVIRONMENT === 'production' ? 0.1 : 1.0,
    };

    if (this.config.dsn == null) {
      console.warn('Sentry DSN not configured, error tracking disabled');
      return;
    }

    // Note: In Cloudflare Workers, Sentry is initialized via withSentry wrapper
    // This flag indicates if we have a valid config
    this.initialized = true;
  }

  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  getErrorGroups(): ErrorGroup[] {
    return Array.from(this.errors.values());
  }

  getConfig(): SentryConfig {
    return this.config;
  }

  captureException(
    error: Error | unknown,
    context?: {
      honoContext?: Context;
      extra?: Record<string, unknown>;
      tags?: Record<string, string>;
      user?: { id?: string; ip_address?: string };
    },
  ): ErrorEvent {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const id = generateUniqueId();
    const fingerprint = generateFingerprint(message, stack);
    const errorEvent: ErrorEvent = {
      id,
      fingerprint,
      timestamp: Date.now(),
      error: {
        message,
        stack,
        type: error instanceof Error ? error.name : typeof error,
      },
    };

    if (!this.initialized) {
      console.error('Sentry not initialized');
      return errorEvent;
    }

    this.updateErrorGroup(errorEvent);

    sentryWithScope((scope) => {
      applyContextToScope(scope, context);
      sentryCaptureException(error);
    });

    return errorEvent;
  }

  captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' = 'info'): void {
    if (!this.initialized) {
      console.log(`[${level}] ${message}`);
      return;
    }

    sentryCaptureMessage(message, level);
  }

  onThresholdExceeded?(errors: ErrorGroup[]): void;

  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
    data?: Record<string, unknown>;
  }): void {
    if (!this.initialized) {
      return;
    }

    sentryAddBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'custom',
      level: breadcrumb.level || 'info',
      ...(breadcrumb.data && { data: breadcrumb.data }),
      timestamp: Date.now() / 1000,
    });
  }

  private updateErrorGroup(event: ErrorEvent): void {
    const group = this.errors.get(event.fingerprint);

    if (group != null) {
      group.count++;
      group.lastSeen = event.timestamp;

      // if the threshold is reached, notify the error
      if (group.count === this.threshold && this.onThresholdExceeded) {
        this.onThresholdExceeded([group]);
      }
    } else {
      this.errors.set(event.fingerprint, {
        fingerprint: event.fingerprint,
        count: 1,
        firstSeen: event.timestamp,
        lastSeen: event.timestamp,
        sample: event,
      });

      // if the threshold is 1, notify the first error
      if (this.threshold === 1 && this.onThresholdExceeded) {
        this.onThresholdExceeded([this.errors.get(event.fingerprint)!]);
      }
    }
  }
}

export const createSentryErrorTracker = (env: Record<string, string | undefined>): SentryErrorTracker =>
  new SentryErrorTracker(env);
