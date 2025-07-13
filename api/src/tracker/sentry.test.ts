import type { Scope } from '@sentry/cloudflare';
import * as Sentry from '@sentry/cloudflare';
import { describe, expect, test, vi } from 'vitest';

import { createSentryErrorTracker, SentryErrorTracker } from './sentry';

vi.mock('@sentry/cloudflare', () => ({
  init: vi.fn(),
  getCurrentScope: vi.fn(),
  withScope: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
  withSentry: vi.fn(),
}));

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
  vi.useRealTimers();
};

const setupTest = (): {
  tracker: SentryErrorTracker;
  mockRequest: Request;
  mockEnv: Record<string, string>;
  mockContext: Record<string, unknown>;
  mockScope: Scope;
} => {
  cleanupTest();

  const mockRequest = new Request('https://example.com');
  const mockEnv = {
    SENTRY_DSN: 'https://test@sentry.io/123456',
    ENVIRONMENT: 'production',
    RELEASE_VERSION: 'v1.0.0',
  };
  const mockContext = {};
  const mockScope = {
    setExtra: vi.fn(),
    setTag: vi.fn(),
    setUser: vi.fn(),
    setContext: vi.fn(),
  } as unknown as Scope;

  vi.mocked(Sentry.getCurrentScope).mockReturnValue(mockScope);
  vi.mocked(Sentry.withScope).mockImplementation(((callback: (scope: Scope) => void) => {
    callback(mockScope);
  }) as typeof Sentry.withScope);
  vi.useFakeTimers();

  return {
    tracker: new SentryErrorTracker(mockEnv),
    mockRequest,
    mockEnv,
    mockContext,
    mockScope,
  };
};

describe('SentryErrorTracker', () => {
  describe('initialization', () => {
    test('stores configuration with provided DSN', () => {
      // Given
      const { tracker } = setupTest();
      const expected = {
        dsn: 'https://test@sentry.io/123456',
        environment: 'production',
        release: 'v1.0.0',
        tracesSampleRate: 0.1,
      };

      // When
      const config = tracker.getConfig();

      // Then
      expect(config).toEqual(expected);
    });

    test('warns and skips initialization when DSN is not provided', () => {
      // Given
      setupTest();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const envWithoutDsn = { SENTRY_DSN: undefined };

      // When
      const trackerWithoutDsn = new SentryErrorTracker(envWithoutDsn);

      // Then
      expect(consoleWarnSpy).toHaveBeenCalledWith('Sentry DSN not configured, error tracking disabled');
      expect(trackerWithoutDsn.getConfig().dsn).toBeUndefined();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('captureException', () => {
    test('returns ErrorEvent with correct structure', () => {
      // Given
      const { tracker } = setupTest();
      const errorMessage = 'Test error';
      const error = new Error(errorMessage);
      const expected = {
        id: expect.any(String),
        fingerprint: expect.any(String),
        timestamp: expect.any(Number),
        error: {
          message: errorMessage,
          stack: expect.any(String),
          type: 'Error',
        },
      };

      // When
      const result = tracker.captureException(error);

      // Then
      expect(result).toMatchObject(expected);
    });

    test('captures exception with context to Sentry', () => {
      // Given
      const { tracker, mockScope } = setupTest();
      const error = new Error('Test error');
      const context = {
        extra: { key: 'value' },
        tags: { env: 'test' },
        user: { id: 'user123' },
      };

      // When
      tracker.captureException(error, context);

      // Then
      expect(mockScope.setExtra).toHaveBeenCalledWith('key', 'value');
      expect(mockScope.setTag).toHaveBeenCalledWith('env', 'test');
      expect(mockScope.setUser).toHaveBeenCalledWith({ id: 'user123' });
      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    test('handles non-Error objects', () => {
      // Given
      const { tracker } = setupTest();
      const nonErrorObject = 'string error';
      const expected = {
        id: expect.any(String),
        fingerprint: expect.any(String),
        timestamp: expect.any(Number),
        error: {
          message: nonErrorObject,
          stack: undefined,
          type: 'string',
        },
      };

      // When
      const result = tracker.captureException(nonErrorObject);

      // Then
      expect(result).toMatchObject(expected);
    });
  });

  describe('Error grouping', () => {
    test('groups errors by fingerprint', () => {
      // Given
      const { tracker } = setupTest();
      const sameErrorMessage = 'Same error';
      const error1 = new Error(sameErrorMessage);
      const error2 = new Error(sameErrorMessage);

      // When
      tracker.captureException(error1);
      tracker.captureException(error2);

      // Then
      const groups = tracker.getErrorGroups();
      expect(groups).toHaveLength(1);
      expect(groups[0].count).toBe(2);
    });

    test('triggers onThresholdExceeded when threshold is reached', () => {
      // Given
      const { tracker } = setupTest();
      const mockCallback = vi.fn();
      const threshold = 3;
      const error = new Error('Repeated error');
      tracker.onThresholdExceeded = mockCallback;
      tracker.setThreshold(threshold);

      // When
      tracker.captureException(error);
      tracker.captureException(error);
      expect(mockCallback).not.toHaveBeenCalled();

      tracker.captureException(error);

      // Then
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith([
        expect.objectContaining({
          fingerprint: expect.any(String),
          count: threshold,
        }),
      ]);
    });
  });

  describe('captureMessage', () => {
    test('captures message to Sentry', () => {
      // Given
      const { tracker } = setupTest();
      const message = 'Test message';
      const level = 'info';

      // When
      tracker.captureMessage(message, level);

      // Then
      expect(Sentry.captureMessage).toHaveBeenCalledWith(message, level);
    });

    test('falls back to console when Sentry is not initialized', () => {
      // Given
      const tracker = new SentryErrorTracker({}); // No SENTRY_DSN
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const message = 'Test message';
      const level = 'warning';

      // When
      tracker.captureMessage(message, level);

      // Then
      expect(consoleLogSpy).toHaveBeenCalledWith(`[${level}] ${message}`);
      consoleLogSpy.mockRestore();
    });
  });

  describe('addBreadcrumb', () => {
    test('adds breadcrumb to Sentry', () => {
      // Given
      const { tracker } = setupTest();
      const breadcrumb = {
        message: 'User clicked button',
        category: 'ui',
        level: 'info' as const,
        data: { buttonId: 'submit' },
      };
      const expected = {
        ...breadcrumb,
        timestamp: expect.any(Number),
      };

      // When
      tracker.addBreadcrumb(breadcrumb);

      // Then
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expected);
    });
  });

  describe('Factory pattern', () => {
    test('creates unique instances for each factory call', () => {
      // Given
      const { mockEnv } = setupTest();

      // When
      const instance1 = createSentryErrorTracker(mockEnv);
      const instance2 = createSentryErrorTracker(mockEnv);

      // Then
      expect(instance1).toBeInstanceOf(SentryErrorTracker);
      expect(instance2).toBeInstanceOf(SentryErrorTracker);
      expect(instance1).not.toBe(instance2);
    });

    test('applies environment-specific configuration to each tracker instance', () => {
      // Given
      const prodEnv = {
        SENTRY_DSN: 'https://test@sentry.io/123456',
        ENVIRONMENT: 'production',
        RELEASE_VERSION: 'v1.0.0',
      };
      const devEnv = {
        SENTRY_DSN: 'https://test@sentry.io/789012',
        ENVIRONMENT: 'development',
        RELEASE_VERSION: 'v0.1.0',
      };

      // When
      const prodSentryErrorTracker = createSentryErrorTracker(prodEnv);
      const devSentryErrorTracker = createSentryErrorTracker(devEnv);

      // Then
      expect(prodSentryErrorTracker.getConfig().environment).toBe('production');
      expect(devSentryErrorTracker.getConfig().environment).toBe('development');
      expect(prodSentryErrorTracker.getConfig().tracesSampleRate).toBe(0.1);
      expect(devSentryErrorTracker.getConfig().tracesSampleRate).toBe(1.0);
    });

    test('logs warning when creating tracker without DSN configuration', () => {
      // Given
      const envWithoutDSN = {
        ENVIRONMENT: 'test',
      };
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // When
      createSentryErrorTracker(envWithoutDSN);

      // Then
      expect(consoleWarnSpy).toHaveBeenCalledWith('Sentry DSN not configured, error tracking disabled');
    });
  });
});
