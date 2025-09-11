/// <reference types="@cloudflare/workers-types/experimental" />
/// <reference types="astro/client" />

// Define environment variables available via import.meta.env
interface ImportMetaEnv {
  // Environment variables for Cloudflare Workers
  readonly PUBLIC_SENTRY_DSN?: string;

  // Service binds by Cloudflare
  readonly ASSETS: Fetcher;
  readonly HYPERDRIVE: Hyperdrive;
  readonly RATE_LIMITER?: RateLimit;

  // Runtime environment marker injected by Wrangler
  readonly ENVIRONMENT?: 'dev' | 'preview' | 'production';

  // Astro built-in environment variables
  readonly MODE: 'development' | 'production';
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly BASE_URL: string;
  readonly SITE?: string;
  readonly ASSETS_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type EnvKey = keyof ImportMetaEnv;

// Cloudflare Workers Runtime types
declare namespace App {
  interface Locals {
    runtime?: {
      env: {
        [key: EnvKey]: ImportMetaEnv[Key];
      };
    };
  }
}
