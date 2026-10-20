// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL: the final public address of the content site.
// Placeholder until Or picks the subdomain (see docs/DNS.md).
const SITE_URL = process.env.SITE_URL || 'https://learn.maaser-plus.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/forum/topic/') })],
});
