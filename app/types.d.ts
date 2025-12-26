import type { Runtime } from '@astrojs/cloudflare';
import type { Hyperdrive, RateLimit } from '@cloudflare/workers-types/experimental';

type Env = {
  readonly DATABASE_URL?: string;
  readonly HYPERDRIVE?: Hyperdrive;
  readonly LIKES_RATE_LIMITER?: RateLimit;
  readonly NODE_ENV?: string;
};

type CloudFlareRuntime = Runtime<Env>;

declare global {
  declare namespace App {
    interface Locals {
      runtime?: CloudFlareRuntime['runtime'];
    }
  }
}
