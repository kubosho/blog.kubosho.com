import type { APIContext } from 'astro';

export function getDatabaseUrl(context?: APIContext['locals']): string | undefined {
  // Cloudflare environment
  const connectionString = context?.runtime?.env?.HYPERDRIVE?.connectionString;
  if (connectionString != null && connectionString !== '') {
    return connectionString;
  }

  // Fallback for Astro environment
  if (context?.runtime?.env?.DATABASE_URL != null && context.runtime.env.DATABASE_URL !== '') {
    return context.runtime.env.DATABASE_URL;
  }

  // Fallback for Node.js environment
  return process.env.DATABASE_URL;
}
