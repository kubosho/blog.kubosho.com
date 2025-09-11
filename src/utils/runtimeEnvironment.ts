import type { AstroGlobal } from 'astro';

import { SITE_HOSTNAME } from '../../constants/siteData';
import { getEnvVar } from './environmentVariablesGetter';

export type RuntimeEnvironment = 'dev' | 'preview' | 'production';

function normalize(value: string | null | undefined): RuntimeEnvironment | null {
  const v = (value ?? '').toString().toLowerCase();
  if (v === 'production' || v === 'preview' || v === 'dev') {
    return v;
  }

  return null;
}

/**
 * Resolve runtime environment using (priority):
 * 1) Cloudflare/Wrangler vars: env.ENVIRONMENT
 * 2) Hostname allowlist (custom domain -> production)
 * 3) Build mode fallback (import.meta.env.PROD -> production)
 */
export function getRuntimeEnvironment(Astro?: AstroGlobal | null): RuntimeEnvironment {
  const explicit = normalize(getEnvVar(Astro ?? null, 'ENVIRONMENT'));
  if (explicit != null) {
    return explicit;
  }

  const hostname = Astro?.url?.hostname;
  if (hostname != null && hostname === SITE_HOSTNAME) {
    return 'production';
  }

  return import.meta.env.PROD ? 'production' : 'dev';
}

export function isProduction(Astro?: AstroGlobal | null): boolean {
  return getRuntimeEnvironment(Astro) === 'production';
}

export function isPreview(Astro?: AstroGlobal | null): boolean {
  return getRuntimeEnvironment(Astro) === 'preview';
}

export function isDev(Astro?: AstroGlobal | null): boolean {
  return getRuntimeEnvironment(Astro) === 'dev';
}
