import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import { defineConfig, passthroughImageService, sessionDrivers } from 'astro/config';

import { SITE_URL } from './constants/siteData';

export default defineConfig({
  adapter: cloudflare(),
  build: {
    format: 'preserve',
  },
  compressHTML: true,
  image: {
    service: passthroughImageService(),
  },
  // @sentry/astro's SDK injection resolves to the browser entry during Cloudflare prerender.
  integrations: [mdx(), react(), sitemap(), sentry({ enabled: false })],
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
    },
    shikiConfig: {
      defaultColor: 'light-dark()',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  output: 'static',
  // The app does not use Astro.server sessions. Make the driver explicit so
  // @astrojs/cloudflare does not auto-provision a SESSION KV namespace at deploy time.
  session: {
    driver: sessionDrivers.lruCache(),
  },
  site: SITE_URL,
  vite: {
    define: {
      'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
    },
  },
});
