// POST /functions/submitStory { title, body, name, anonymous, contact, consent, website, started_at } → { ok: true }
// Saved as status "new". Stories are NEVER published automatically: Or reads them in the admin inbox page,
// and publishes an approved story by adding it in Pages CMS → סיפורים (see docs/HOW-TO-ADD-ARTICLE.md).
import { createClientFromRequest } from 'npm:@base44/sdk';
import { json, preflight, clean, ipHash, looksLikeBot, rateLimited, notify } from '../shared/community.ts';

Deno.serve(async (req) => {
  const pf = preflight(req); if (pf) return pf;
  try {
    const b = await req.json().catch(() => ({}));
    if (looksLikeBot(b)) return json(req, { ok: true });
    const title = clean(b.title, 120), body = clean(b.body, 6000), name = clean(b.name, 60), contact = clean(b.contact, 120);
    if (title.length < 3 || body.length < 80 || b.consent !== true) return json(req, { error: 'invalid' }, 400);
    const base44 = createClientFromRequest(req);
    const E = base44.asServiceRole.entities.StorySubmission;
    const hash = await ipHash(req);
    if (await rateLimited(E, hash, 3)) return json(req, { error: 'rate' }, 429);
    await E.create({ title, body, name, anonymous: b.anonymous === true, contact, status: 'new', ip_hash: hash });
    await notify(base44, `סיפור חדש התקבל: ${title}`, `${body}\n\nשם: ${name || '-'} | עילום שם: ${b.anonymous === true ? 'כן' : 'לא'} | קשר: ${contact || '-'}`); // optional; the item already waits in the admin inbox
    return json(req, { ok: true });
  } catch (e) { return json(req, { error: 'server' }, 500); }
});
