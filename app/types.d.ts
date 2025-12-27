import type {
  CacheStorage as CloudflareCacheStorage,
  ExecutionContext,
  ExportedHandlerFetchHandler,
  Hyperdrive,
  RateLimit,
} from '@cloudflare/workers-types/experimental';

type Env = {
  readonly DATABASE_URL?: string;
  readonly HYPERDRIVE?: Hyperdrive;
  readonly LIKES_RATE_LIMITER?: RateLimit;
  readonly NODE_ENV?: string;
};

type CloudflareRuntime<T extends object> = {
  runtime: {
    env: Env & T;
    cf: Parameters<ExportedHandlerFetchHandler>[0]['cf'];
    caches: CloudflareCacheStorage;
    ctx: ExecutionContext;
  };
};

declare global {
  declare namespace App {
    interface Locals {
      runtime?: CloudflareRuntime<Env>['runtime'];
    }
  }
}
