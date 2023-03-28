import { defineConfig } from 'astro/config';
// eslint-disable-next-line import/no-unresolved
import react from '@astrojs/react';
// eslint-disable-next-line import/no-unresolved
import sitemap from '@astrojs/sitemap';
// eslint-disable-next-line import/no-unresolved
import vercel from '@astrojs/vercel/serverless';

import { SITE_URL } from './constants/site_data';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [react(), sitemap()],
  site: SITE_URL,
  output: 'server',
});
