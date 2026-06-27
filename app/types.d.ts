declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_SENTRY_DSN: string;
  }

  namespace Cloudflare {
    interface Env {
      DATABASE_URL?: string;
      HYPERDRIVE?: Hyperdrive;
      LIKES_RATE_LIMITER?: RateLimit;
      NODE_ENV?: string;
    }
  }
}

export {};
