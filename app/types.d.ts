declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_SENTRY_DSN: string;
  }

  namespace Cloudflare {
    interface Env {
      DATABASE_URL?: string;
      HYPERDRIVE?: Hyperdrive;
      LIKES_RATE_LIMITER?: RateLimit;
      CLOUDFLARE_ENV?: string;
      NODE_ENV?: string;
      PUBLIC_SENTRY_DSN?: string;
      SENTRY_DSN?: string;
      SENTRY_ENVIRONMENT?: string;
      SENTRY_TRACES_SAMPLE_RATE?: string;
    }
  }
}

export {};
