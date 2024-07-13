import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './constants/site_data';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), sitemap()],
  site: SITE_URL,
});
