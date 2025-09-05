import type { AstroGlobal } from 'astro';
import { describe, expect, it } from 'vitest';

import { getEnvVar } from './environmentVariablesGetter';

/**
 * Astro.locals mock object.
 * @param env - Environment variables to include in the mock
 * @returns App.Locals object with runtime.env populated
 */
export function createMockAstroLocals(env: Record<string, string>): App.Locals {
  return {
    runtime: {
      env: env as Record<keyof ImportMetaEnv, string>,
    },
  };
}

describe('getEnvVar', () => {
  it('should return value from Cloudflare runtime env', () => {
    // Given
    const mockAstro = {
      locals: createMockAstroLocals({
        PUBLIC_API_BASE_URL: 'https://api.cloudflare.com',
      }),
    } as AstroGlobal;

    // When
    const result = getEnvVar(mockAstro, 'PUBLIC_API_BASE_URL');

    // Then
    expect(result).toBe('https://api.cloudflare.com');
  });

  it('should fallback to import.meta.env when Cloudflare env not available', () => {
    // Given
    const mockMetaEnv = {
      PUBLIC_API_BASE_URL: 'https://local.api.com',
      MODE: 'development',
      PROD: false,
      DEV: true,
      BASE_URL: '/',
    } as ImportMetaEnv;

    // When
    const result = getEnvVar(null, 'PUBLIC_API_BASE_URL', undefined, mockMetaEnv);

    // Then
    expect(result).toBe('https://local.api.com');
  });

  it('should return fallback value when env var not found', () => {
    // Given
    const mockMetaEnv = {
      MODE: 'development',
      PROD: false,
      DEV: true,
      BASE_URL: '/',
    } as ImportMetaEnv;

    // When
    const result = getEnvVar(null, 'NON_EXISTENT', 'default-value', mockMetaEnv);

    // Then
    expect(result).toBe('default-value');
  });

  it('should return undefined when no env var and no fallback', () => {
    // Given
    const mockMetaEnv = {
      MODE: 'development',
      PROD: false,
      DEV: true,
      BASE_URL: '/',
    } as ImportMetaEnv;

    // When
    const result = getEnvVar(null, 'NON_EXISTENT', undefined, mockMetaEnv);

    // Then
    expect(result).toBeUndefined();
  });

  it('should prioritize Cloudflare env over import.meta.env', () => {
    // Given
    const mockAstro = {
      locals: createMockAstroLocals({
        PUBLIC_API_BASE_URL: 'https://cloudflare.api.com',
      }),
    } as AstroGlobal;

    const mockMetaEnv = {
      PUBLIC_API_BASE_URL: 'https://local.api.com',
      MODE: 'development',
      PROD: false,
      DEV: true,
      BASE_URL: '/',
    } as ImportMetaEnv;

    // When
    const result = getEnvVar(mockAstro, 'PUBLIC_API_BASE_URL', undefined, mockMetaEnv);

    // Then
    expect(result).toBe('https://cloudflare.api.com');
  });
});
