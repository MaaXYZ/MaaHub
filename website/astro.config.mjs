import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://maahub.github.io',
  base: process.env.SITE_BASE_URL ?? '/',
  integrations: [react(), tailwind(), sitemap()]
});
