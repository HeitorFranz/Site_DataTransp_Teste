import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://datatransp.com.br',
  trailingSlash: 'never',
  compressHTML: true,
  vite: {
    tsconfig: 'tsconfig.json',
  },
  integrations: [react()],
});
