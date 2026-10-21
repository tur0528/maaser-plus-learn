// POST /functions/forumCreateReply { topic_id, body, name, consent, website, started_at } → { ok: true }
import { createClientFromRequest } from 'npm:@base44/sdk';
import { json, preflight, clean, ipHash, looksLikeBot, rateLimited, notify } from '../shared/community.ts';

Deno.serve(async (req) => {
  const pf = preflight(req); if (pf) return pf;
  try {
    const b = await req.json().catch(() => ({}));
    if (looksLikeBot(b)) return json(req, { ok: true });
    const topic_id = clean(b.topic_id, 64), body = clean(b.body, 3000), author = clean(b.name, 40);
    if (!topic_id || body.length < 2 || b.consent !== true) return json(req, { error: 'invalid' }, 400);
    const base44 = createClientFromRequest(req);
    const [t] = await base44.asServiceRole.entities.ForumTopic.filter({ id: topic_id, status: 'approved' }, '-created_date', 1);
    if (!t) return json(req, { error: 'not-found' }, 404);
    const E = base44.asServiceRole.entities.ForumReply;
    const hash = await ipHash(req);
    if (await rateLimited(E, hash, 6)) return json(req, { error: 'rate' }, 429);
    await E.create({ topic_id, body, author, status: 'pending', ip_hash: hash });
    await notify(base44, `תגובה חדשה ממתינה לאישור: ${t.title}`, `${body}\n\nמאת: ${author || 'בעילום שם'}`); // optional; the item already waits in the admin inbox
    return json(req, { ok: true });
  } catch (e) { return json(req, { error: 'server' }, 500); }
});
