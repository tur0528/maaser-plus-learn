// POST /functions/forumCreateTopic { title, body, name, consent, website, started_at } → { ok: true }
// Saves as status "pending". Nothing is public until Or approves it in the admin inbox page (adminInbox / adminModerate).
import { createClientFromRequest } from 'npm:@base44/sdk';
import { json, preflight, clean, ipHash, looksLikeBot, rateLimited, notify } from '../shared/community.ts';

Deno.serve(async (req) => {
  const pf = preflight(req); if (pf) return pf;
  try {
    const b = await req.json().catch(() => ({}));
    if (looksLikeBot(b)) return json(req, { ok: true }); // silently drop
    const title = clean(b.title, 120), body = clean(b.body, 4000), author = clean(b.name, 40);
    if (title.length < 6 || body.length < 10 || b.consent !== true) return json(req, { error: 'invalid' }, 400);
    const base44 = createClientFromRequest(req);
    const E = base44.asServiceRole.entities.ForumTopic;
    const hash = await ipHash(req);
    if (await rateLimited(E, hash, 3)) return json(req, { error: 'rate' }, 429);
    await E.create({ title, body, author, status: 'pending', reply_count: 0, ip_hash: hash });
    await notify(base44, `נושא חדש ממתין לאישור: ${title}`, `${body}\n\nמאת: ${author || 'בעילום שם'}\nלאישור: תיבת הניהול באפליקציית הקהילה`); // optional; the item already waits in the admin inbox
    return json(req, { ok: true });
  } catch (e) { return json(req, { error: 'server' }, 500); }
});
