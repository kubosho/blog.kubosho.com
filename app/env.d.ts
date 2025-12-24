/// <reference types="@cloudflare/workers-types/experimental" />

type CloudFlareRuntime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  readonly DATABASE_URL?: string;
  readonly HYPERDRIVE?: Hyperdrive;
  readonly LIKES_RATE_LIMITER?: RateLimit;
  readonly NODE_ENV?: string;
}

declare namespace App {
  interface Locals {
    runtime?: CloudFlareRuntime['runtime'];
  }
}
