import fs from 'node:fs';
export const heDate = (d: Date) => new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
export const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) => b.data.date.getTime() - a.data.date.getTime();
export const visible = <T extends { data: { draft?: boolean } }>(e: T) => !e.data.draft;
export const CATS = [
  { slug: 'halacha', name: 'הלכה' },
  { slug: 'mas', name: 'מס' },
  { slug: 'guides', name: 'מדריכים' },
] as const;
/** og image for an entry if scripts/og.mjs rendered one, otherwise the default */
export const ogFor = (kind: 'articles' | 'stories', id: string) =>
  fs.existsSync(`public/og/${kind}/${id}.jpg`) ? `/og/${kind}/${id}.jpg` : '/og/default.jpg';
/** turn "label: https://..." source lines into {text, url} */
export const parseSource = (s: string) => {
  const m = s.match(/^(.*?):\s*(https?:\/\/\S+)\s*$/);
  return m ? { text: m[1], url: m[2] } : { text: s, url: undefined };
};
