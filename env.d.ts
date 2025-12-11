/// <reference types="@cloudflare/workers-types/experimental" />
/// <reference types="astro/client" />

type CloudFlareRuntime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  readonly DATABASE_URL?: string;
  readonly HYPERDRIVE?: Hyperdrive;
  readonly NODE_ENV?: string;
}

declare namespace App {
  interface Locals {
    runtime?: CloudFlareRuntime['runtime'];
  }
}
