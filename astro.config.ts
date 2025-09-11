import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { defineConfig, passthroughImageService } from 'astro/config';

import { SITE_URL } from './constants/siteData';
import { isPreview, isProduction } from './src/utils/runtimeEnvironment';

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
  image: {
    service: passthroughImageService(),
  },
  integrations: [react(), sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  output: 'static',
  ...(isProduction() && {
    site: SITE_URL,
  }),
  vite: {
    ...((isProduction() || isPreview()) && {
      resolve: {
        alias: {
          'react-dom/server': 'react-dom/server.edge',
        },
      },
    }),
  },
});
