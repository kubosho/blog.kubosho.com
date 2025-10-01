import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
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
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    syntaxHighlight: 'prism',
  },
  output: 'static',
  site: SITE_URL,
});
