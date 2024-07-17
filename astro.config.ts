import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';

import { SITE_URL } from './constants/site_data';

function getAdapter(): AstroIntegration {
  if (process.env.USE_NODE_ADAPTER) {
    return node({ mode: 'standalone' });
  }

  return cloudflare();
}

export default defineConfig({
  adapter: getAdapter(),
  integrations: [react(), sitemap()],
  output: 'hybrid',
  site: SITE_URL,
});
