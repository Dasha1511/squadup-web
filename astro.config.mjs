import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://squadup.ru',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    server: {
      // В режиме разработки форма подписки ходит в локальный обработчик
      proxy: { '/api': 'http://127.0.0.1:8787' },
    },
  },
});
