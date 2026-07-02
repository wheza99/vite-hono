// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Used for sitemap + RSS canonical URL generation.
  // Override per-startup via the SITE constant in src/styles/theme.ts.
  site: 'https://yourdomain.com',
  output: 'static',
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
