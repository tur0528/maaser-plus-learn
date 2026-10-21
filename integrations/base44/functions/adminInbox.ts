// POST /functions/adminInbox {} → { topics, replies, stories, counts } — everything waiting for Or's approval.
// ADMIN ONLY: called from the "תיבת ניהול" page inside the Base44 community app, by a logged-in admin (Or).
// This replaces email alerts: new topics / replies / stories show up here with status pending / new.
import { createClientFromRequest } from 'npm:@base44/sdk';
import { requireAdmin } from '../shared/community.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    if (!(await requireAdmin(base44))) return Response.json({ error: 'forbidden' }, { status: 403 });
    const S = base44.asServiceRole.entities;
    const [topics, replies, stories] = await Promise.all([
      S.ForumTopic.filter({ status: 'pending' }, '-created_date', 200),
      S.ForumReply.filter({ status: 'pending' }, '-created_date', 200),
      S.StorySubmission.filter({ status: 'new' }, '-created_date', 200),
    ]);
    // attach the topic title to each pending reply, for context
    const ids = [...new Set(replies.map((r: any) => r.topic_id))];
    const parents = ids.length ? await Promise.all(ids.map((id) => S.ForumTopic.filter({ id }, '-created_date', 1))) : [];
    const title: Record<string, string> = {};
    parents.flat().forEach((t: any) => (title[t.id] = t.title));
    const strip = ({ ip_hash, ...rest }: any) => rest; // never show ip_hash
    return Response.json({
      topics: topics.map(strip),
      replies: replies.map((r: any) => ({ ...strip(r), topic_title: title[r.topic_id] || '' })),
      stories: stories.map(strip),
      counts: { topics: topics.length, replies: replies.length, stories: stories.length },
    });
  } catch (e) { return Response.json({ error: 'server' }, { status: 500 }); }
});
