// Local mock of the Base44 community functions, for testing the forms without Or's account.
// usage: node tools/mock-community.mjs  → http://localhost:8787  (set community_api_base to it, rebuild)
import http from 'node:http';
const db = { topics: [], replies: [], stories: [] }; let n = 0;
const send = (res, code, data) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }); res.end(JSON.stringify(data)); };
http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  let raw = ''; req.on('data', (c) => (raw += c)); req.on('end', () => {
    const b = raw ? JSON.parse(raw) : {}; const fn = req.url.split('/').pop(); const now = new Date().toISOString();
    if (fn === 'forumList') return send(res, 200, { topics: db.topics.filter((t) => t.status === 'approved').map((t) => ({ ...t, reply_count: db.replies.filter((r) => r.topic_id === t.id && r.status === 'approved').length })) });
    if (fn === 'forumGetTopic') { const t = db.topics.find((x) => x.id === b.id && x.status === 'approved'); return t ? send(res, 200, { topic: { ...t, replies: db.replies.filter((r) => r.topic_id === t.id && r.status === 'approved') } }) : send(res, 404, { error: 'not-found' }); }
    if (fn === 'forumCreateTopic') { db.topics.push({ id: 't' + ++n, title: b.title, body: b.body, author: b.name, created: now, status: 'pending' }); return send(res, 200, { ok: true }); }
    if (fn === 'forumCreateReply') { db.replies.push({ topic_id: b.topic_id, body: b.body, author: b.name, created: now, status: 'pending' }); return send(res, 200, { ok: true }); }
    if (fn === 'submitStory') { db.stories.push({ ...b, status: 'new' }); return send(res, 200, { ok: true }); }
    if (fn === '_approveAll') { db.topics.forEach((t) => (t.status = 'approved')); db.replies.forEach((r) => (r.status = 'approved')); return send(res, 200, { ok: true }); }
    if (fn === '_db') return send(res, 200, db);
    send(res, 404, { error: 'unknown' });
  });
}).listen(8787, () => console.log('mock on :8787'));
