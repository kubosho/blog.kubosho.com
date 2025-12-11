import type { APIContext } from 'astro';

export function getDatabaseUrl(context?: APIContext['locals']): string | undefined {
  // Cloudflare environment
  const connectionString = context?.runtime?.env?.HYPERDRIVE?.connectionString;
  if (connectionString != null && connectionString !== '') {
    return connectionString;
  }

  // Fallback for local environment
  return process.env.DATABASE_URL;
}
