import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://datatransp.com.br',
  trailingSlash: 'never',
  compressHTML: true,
  vite: {
    tsconfig: 'tsconfig.json',
  },
});
