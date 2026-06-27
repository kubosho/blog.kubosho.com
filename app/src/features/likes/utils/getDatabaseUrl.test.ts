import { afterEach, describe, expect, test, vi } from 'vitest';

import type { LikesRuntimeEnv } from '../api/runtimeEnv';
import { getDatabaseUrl } from './getDatabaseUrl';

describe('getDatabaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('Hyperdrive connection string is used before DATABASE_URL binding', () => {
    // Arrange
    const env = {
      DATABASE_URL: 'postgres://env',
      HYPERDRIVE: {
        connectionString: 'postgres://hyperdrive',
      },
    } as LikesRuntimeEnv;

    // Act
    const result = getDatabaseUrl(env);

    // Assert
    expect(result).toBe('postgres://hyperdrive');
  });

  test('DATABASE_URL binding is used when Hyperdrive is unavailable', () => {
    // Arrange
    const env = {
      DATABASE_URL: 'postgres://env',
    } satisfies LikesRuntimeEnv;

    // Act
    const result = getDatabaseUrl(env);

    // Assert
    expect(result).toBe('postgres://env');
  });

  test('process DATABASE_URL is used when Cloudflare bindings are unavailable', () => {
    // Arrange
    vi.stubEnv('DATABASE_URL', 'postgres://process');

    // Act
    const result = getDatabaseUrl();

    // Assert
    expect(result).toBe('postgres://process');
  });
});
