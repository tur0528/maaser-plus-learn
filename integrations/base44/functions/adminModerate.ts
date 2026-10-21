// POST /functions/adminModerate { kind: 'topic'|'reply'|'story', id, action: 'approve'|'reject' } → { ok: true }
// ADMIN ONLY. Called by the approve / reject buttons in the "תיבת ניהול" page.
// topic/reply: approve → status "approved" (appears on the site), reject → "rejected".
// story: approve → status "approved" (Or then publishes it as a story in Pages CMS), reject → "rejected".
import { createClientFromRequest } from 'npm:@base44/sdk';
import { requireAdmin, clean } from '../shared/community.ts';

const ENTITY: Record<string, string> = { topic: 'ForumTopic', reply: 'ForumReply', story: 'StorySubmission' };

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    if (!(await requireAdmin(base44))) return Response.json({ error: 'forbidden' }, { status: 403 });
    const b = await req.json().catch(() => ({}));
    const name = ENTITY[b.kind]; const id = clean(b.id, 64);
    if (!name || !id || !['approve', 'reject'].includes(b.action)) return Response.json({ error: 'invalid' }, { status: 400 });
    await base44.asServiceRole.entities[name].update(id, { status: b.action === 'approve' ? 'approved' : 'rejected' });
    return Response.json({ ok: true });
  } catch (e) { return Response.json({ error: 'server' }, { status: 500 }); }
});
