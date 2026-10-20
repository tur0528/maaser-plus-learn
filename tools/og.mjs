// Render og:images (1200x630) for every article/story with Skye's template + headless Chrome.
// usage: node tools/og.mjs   (writes .jpg; needs python3 + Pillow for the PNG→JPG step)
//   (needs google-chrome; run before `npm run build` when titles change)
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tpl = path.join(root, 'tools/og-template.html');
const chrome = process.env.CHROME || 'google-chrome';
const fm = (src) => { const m = src.match(/^---\n([\s\S]*?)\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const k = l.match(/^(\w+):\s*"?(.*?)"?\s*$/); if (k) o[k[1]] = k[2]; } return o; };
const render = (out, q) => {
  const url = 'file://' + tpl + '?' + new URLSearchParams(q).toString();
  execFileSync(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=5000', '--window-size=1200,630', `--screenshot=${out}`, url], { stdio: 'ignore' });
  execFileSync('python3', ['-c', `from PIL import Image; import os; p='${out}'; Image.open(p).convert('RGB').save(p[:-4]+'.jpg',quality=84,optimize=True,progressive=True); os.remove(p)`]);
  console.log('og →', path.relative(root, out).replace(/\.png$/, '.jpg'));
};
render(path.join(root, 'public/og/default.png'), { category: 'מעשר כספים', title: 'עשר כדי שתתעשר', subtitle: 'הלכה, מקורות והשראה, ואפליקציה חינמית שעושה את החשבון' });
for (const [kind, cat] of [['articles', 'מאמרים'], ['stories', 'סיפורים']]) {
  const dir = path.join(root, 'src/content', kind);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const d = fm(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (d.draft === 'true') continue;
    const eyebrow = kind === 'articles' && d.category ? `${cat} · ${d.category}` : cat;
    render(path.join(root, `public/og/${kind}/${f.replace(/\.md$/, '')}.png`), { category: eyebrow, title: d.title || '', subtitle: '' });
  }
}
