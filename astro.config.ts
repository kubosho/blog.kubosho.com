import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { SITE_URL } from './constants/site_data';

export default defineConfig({
  adapter: cloudflare(),
  integrations: [react(), sitemap()],
  output: 'hybrid',
  site: SITE_URL,
});
