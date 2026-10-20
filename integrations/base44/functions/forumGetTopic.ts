// POST /functions/forumGetTopic { id } → { topic: {..., replies:[...]} } (approved only)
import { createClientFromRequest } from 'npm:@base44/sdk';
import { json, preflight, clean } from '../shared/community.ts';

Deno.serve(async (req) => {
  const pf = preflight(req); if (pf) return pf;
  try {
    const { id } = await req.json().catch(() => ({}));
    const base44 = createClientFromRequest(req);
    const [t] = await base44.asServiceRole.entities.ForumTopic.filter({ id: clean(id, 64), status: 'approved' }, '-created_date', 1);
    if (!t) return json(req, { error: 'not-found' }, 404);
    const replies = await base44.asServiceRole.entities.ForumReply.filter({ topic_id: t.id, status: 'approved' }, 'created_date', 300);
    return json(req, { topic: { id: t.id, title: t.title, body: t.body, author: t.author || '', created: t.created_date,
      replies: replies.map((r: any) => ({ author: r.author || '', body: r.body, created: r.created_date })) } });
  } catch (e) { return json(req, { error: 'server' }, 500); }
});
