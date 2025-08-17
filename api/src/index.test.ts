import { describe, expect, test, vi } from 'vitest';

import type { ApiEnv } from './index';
import { api } from './index';

const cleanupTest = (): void => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
};

const setupTest = (): {
  consoleWarnSpy: ReturnType<typeof vi.spyOn>;
} => {
  cleanupTest();

  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  return { consoleWarnSpy };
};

describe('API Foundation', () => {
  describe('Root endpoint', () => {
    test('returns "Hello Hono!"', async () => {
      // Given
      setupTest();
      const req = new Request('http://localhost/', {
        method: 'GET',
      });
      const mockEnvironment: ApiEnv['Bindings'] = {
        SENTRY_DSN: 'mock-sentry-dsn',
        ENVIRONMENT: 'test',
        RELEASE_VERSION: 'test',
      };

      // When
      const res = await api.fetch(req, mockEnvironment);
      const data = await res.text();

      // Then
      expect(res.status).toBe(200);
      expect(data).toBe('Hello Hono!');
    });
  });
});
