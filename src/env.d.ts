/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly X_MICROCMS_API_SUB_DOMAIN: string;
  readonly X_MICROCMS_API_NAME: string;
  readonly X_MICROCMS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
