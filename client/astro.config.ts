import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import react from '@astrojs/react';
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
  integrations: [react(), sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  output: 'static',
  site: SITE_URL,
  vite: {
    define: {
      PUBLIC_API_BASE_URL: JSON.stringify(import.meta.env.PUBLIC_API_BASE_URL ?? ''),
    },
    ...(import.meta.env.MODE === 'production' && {
      resolve: {
        alias: {
          'react-dom/server': 'react-dom/server.edge',
        },
      },
    }),
  },
});
