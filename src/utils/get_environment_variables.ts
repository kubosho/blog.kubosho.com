import type { AstroGlobal } from 'astro';

/**
 * Get environment variable value with fallback support
 *
 * @param Astro - The Astro global object (available in .astro files)
 * @param key - The environment variable key
 * @param fallbackValue - Optional fallback value if the variable is not found
 * @param metaEnv - Optional import.meta.env for testing (defaults to actual import.meta.env)
 * @returns The environment variable value or fallback
 */
export function getEnvVar(
  Astro: AstroGlobal | null,
  key: string,
  fallbackValue?: string,
  metaEnv: ImportMetaEnv = import.meta.env,
): string | undefined {
  // Try Cloudflare Workers runtime first (production and wrangler dev)
  const value = Astro?.locals.runtime?.env[key as keyof ImportMetaEnv];
  if (value != null) {
    return value;
  }

  // Fallback to import.meta.env for local development without Wrangler
  const metaEnvValue = metaEnv[key as keyof ImportMetaEnv];
  if (metaEnvValue != null) {
    return metaEnvValue;
  }

  return fallbackValue;
}
