import type { LikesRuntimeEnv } from '../api/runtimeEnv';

export function getDatabaseUrl(env?: LikesRuntimeEnv): string | undefined {
  // Cloudflare environment
  const connectionString = env?.HYPERDRIVE?.connectionString;
  if (connectionString != null && connectionString !== '') {
    return connectionString;
  }

  // Fallback for Astro environment
  if (env?.DATABASE_URL != null && env.DATABASE_URL !== '') {
    return env.DATABASE_URL;
  }

  // Fallback for Node.js environment
  return process.env.DATABASE_URL;
}
