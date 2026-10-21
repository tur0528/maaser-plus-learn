// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Where the site lives. See docs/DNS.md.
// NOW (preview):      https://tur0528.github.io/maaser-plus-learn/   → SITE_URL = https://tur0528.github.io, BASE_PATH = /maaser-plus-learn
// LATER (own domain): https://learn.maaser-plus.com/                 → SITE_URL = https://learn.maaser-plus.com, BASE_PATH = /
//   and add public/CNAME with the line: learn.maaser-plus.com
const SITE_URL = process.env.SITE_URL || 'https://tur0528.github.io';
const BASE_PATH = process.env.BASE_PATH || '/maaser-plus-learn';

// Pages CMS saves images as /media/... ; prefix internal absolute links/images in Markdown with the base path.
const base = BASE_PATH.replace(/\/$/, '');
function rehypeBase() {
  const fix = (v) => (typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && base && !v.startsWith(base + '/') ? base + v : v);
  const walk = (n) => {
    if (n.type === 'element' && n.properties) {
      if (n.tagName === 'img') n.properties.src = fix(n.properties.src);
      if (n.tagName === 'a') n.properties.href = fix(n.properties.href);
    }
    (n.children || []).forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'always',
  markdown: { rehypePlugins: [rehypeBase] },
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') && !page.includes('/forum/topic/') })],
});
