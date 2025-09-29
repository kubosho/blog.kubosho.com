/// <reference types="@cloudflare/workers-types/experimental" />
/// <reference types="astro/client" />

interface Env {
  readonly HYPERDRIVE?: Hyperdrive;
}

type CloudFlareRuntime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals {
    runtime?: CloudFlareRuntime['runtime'];
  }
}
