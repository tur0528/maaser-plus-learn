import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// מאמרים: הלכה, מס ומדריכים. summary מוצג בכרטיסים, גוף הקובץ (body) בעמוד המלא.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    slug: z.string().optional(), // Pages CMS filename / URL
    title: z.string(),
    summary: z.string(),
    category: z.enum(['הלכה', 'מס', 'מדריכים']),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    halachic_review: z.boolean().default(false), // מציג את תיבת "נבדק על ידי הרב"
    sources: z.array(z.string()).default([]),
    cover: z.string().optional(),
    example: z.boolean().default(false), // תוכן לדוגמה, מסומן באתר
    draft: z.boolean().default(false),
  }),
});

// סיפורים: בלוג של סיפורי אנשים (רק אחרי אישור של אור).
const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    slug: z.string().optional(), // Pages CMS filename / URL
    title: z.string(),
    summary: z.string(),
    author: z.string().optional(),
    anonymous: z.boolean().default(false),
    date: z.coerce.date(),
    source: z.string().optional(),
    cover: z.string().optional(),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, stories };
