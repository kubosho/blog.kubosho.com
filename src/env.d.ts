// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly CI: boolean;
        readonly USE_NODE_ADAPTER: boolean;
      }
    }
  }
}
