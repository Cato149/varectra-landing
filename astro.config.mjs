import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

const githubRepository = process.env.GITHUB_REPOSITORY ?? '';
const [githubOwner, githubRepo] = githubRepository.split('/');
const isUserPages = Boolean(githubRepo?.endsWith('.github.io'));
const pagesOrigin = githubOwner
  ? `https://${githubOwner.toLowerCase()}.github.io`
  : undefined;
const pagesBase = !githubRepo || isUserPages ? '/' : `/${githubRepo}/`;

export default defineConfig({
  // SITE / BASE_PATH override CI defaults (custom domain → SITE + BASE_PATH=/).
  site: process.env.SITE ?? pagesOrigin ?? 'https://varectra.example',
  base: process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? pagesBase : '/'),
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
