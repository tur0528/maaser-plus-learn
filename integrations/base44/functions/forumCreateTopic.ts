// POST /functions/forumCreateTopic { title, body, name, consent, website, started_at } → { ok: true }
// Saves as status "pending". Nothing is public until Or sets status = "approved" in Base44 → Data → ForumTopic.
import { createClientFromRequest } from 'npm:@base44/sdk';
import { json, preflight, clean, ipHash, looksLikeBot, rateLimited, NOTIFY_EMAIL } from '../shared/community.ts';

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
    if (NOTIFY_EMAIL.includes('@')) await base44.asServiceRole.integrations.Core.SendEmail({ to: NOTIFY_EMAIL, subject: `נושא חדש ממתין לאישור: ${title}`, body: `${body}\n\nמאת: ${author || 'בעילום שם'}\nלאישור: Base44 → Data → ForumTopic → status = approved` }).catch(() => {});
    return json(req, { ok: true });
  } catch (e) { return json(req, { error: 'server' }, 500); }
});
