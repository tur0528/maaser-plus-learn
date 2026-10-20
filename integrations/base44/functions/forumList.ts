// POST /functions/forumList → { topics: [...] } (approved only, newest first)
import { createClientFromRequest } from 'npm:@base44/sdk';
import { json, preflight } from '../shared/community.ts';

Deno.serve(async (req) => {
  const pf = preflight(req); if (pf) return pf;
  try {
    const base44 = createClientFromRequest(req);
    const rows = await base44.asServiceRole.entities.ForumTopic.filter({ status: 'approved' }, '-created_date', 100);
    // count approved replies per topic (so counts stay right after Or approves replies)
    const reps = await base44.asServiceRole.entities.ForumReply.filter({ status: 'approved' }, '-created_date', 2000);
    const count: Record<string, number> = {};
    for (const r of reps) count[r.topic_id] = (count[r.topic_id] || 0) + 1;
    const topics = rows.map((t: any) => ({ id: t.id, title: t.title, body: String(t.body).slice(0, 400), author: t.author || '', created: t.created_date, reply_count: count[t.id] || 0 }));
    return json(req, { topics });
  } catch (e) { return json(req, { error: 'server' }, 500); }
});
