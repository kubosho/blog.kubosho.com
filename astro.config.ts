import { defineConfig } from 'astro/config';
// eslint-disable-next-line import/no-unresolved
import react from '@astrojs/react';
// eslint-disable-next-line import/no-unresolved
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './constants/site_data';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],
  site: SITE_URL,
});
