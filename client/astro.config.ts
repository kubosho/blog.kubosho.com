import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';

import { SITE_URL } from '../constants/site_data';

function getAdapter(): AstroIntegration {
  if (process.env.USE_NODE_ADAPTER) {
    return node({ mode: 'standalone' });
  }

  return cloudflare();
}

export default defineConfig({
  adapter: getAdapter(),
  build: {
    format: 'preserve',
  },
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  output: 'hybrid',
  redirects: {
    '/entry/[...slug]': '/entries/[...slug]',
  },
  site: SITE_URL,
});
