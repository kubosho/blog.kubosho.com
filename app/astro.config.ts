import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { defineConfig, passthroughImageService } from 'astro/config';

import { SITE_URL } from './constants/siteData';

export default defineConfig({
  adapter: cloudflare(),
  build: {
    format: 'preserve',
  },
  image: {
    service: passthroughImageService(),
  },
  integrations: [mdx(), react(), sitemap()] as AstroIntegration[],
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
  site: SITE_URL,
  vite: {
    define: {
      'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
    },
  },
});
