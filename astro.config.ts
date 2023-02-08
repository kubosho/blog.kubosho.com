import { defineConfig } from 'astro/config';
// eslint-disable-next-line import/no-unresolved
import react from '@astrojs/react';

import { SITE_URL } from './constants/site_data';

export default defineConfig({
  integrations: [react()],
  output: 'server',
  site: SITE_URL,
});
