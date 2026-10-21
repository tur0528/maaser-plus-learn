// Shared helpers for the community functions. Base44 lets functions import from base44/shared/.
// Put this file in base44/shared/community.ts and import it from each function,
// or paste its contents at the top of each function if shared imports are not available.
export const ALLOWED_ORIGINS = [
  'https://tur0528.github.io',      // ← preview on GitHub Pages (origin has no path)
  'https://learn.maaser-plus.com', // ← final address once the subdomain is connected (docs/DNS.md)
  'http://localhost:4321',         // local preview
];
// Notifications: every new item lands in the admin inbox page of the Base44 community app (status pending/new),
// so no email is needed. OPTIONAL: put an email here to ALSO get an email alert per new item. Empty = no email.
export const NOTIFY_EMAIL = '';
const SALT = 'CHANGE_ME_RANDOM_SALT';                // ← any random string

export function cors(req: Request) {
  const o = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(o) ? o : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
export const json = (req: Request, data: unknown, status = 200) => Response.json(data, { status, headers: cors(req) });
export const preflight = (req: Request) => (req.method === 'OPTIONS' ? new Response(null, { status: 204, headers: cors(req) }) : null);

export const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

export async function ipHash(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('cf-connecting-ip') || 'unknown';
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(SALT + ip));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** reject bots: honeypot filled, or the form was submitted < 3s after load */
export const looksLikeBot = (b: any) => Boolean(b?.website) || (Number(b?.started_at) > 0 && Date.now() - Number(b.started_at) < 3000);

/** max N items per ip_hash in the last hour, per entity */
export async function rateLimited(entity: any, hash: string, max = 5) {
  const recent = await entity.filter({ ip_hash: hash }, '-created_date', max);
  const hourAgo = Date.now() - 3600_000;
  return recent.filter((r: any) => new Date(r.created_date).getTime() > hourAgo).length >= max;
}

/** optional email alert. Does nothing while NOTIFY_EMAIL is empty; never fails the request. */
export async function notify(base44: any, subject: string, body: string) {
  if (!NOTIFY_EMAIL.includes('@')) return;
  await base44.asServiceRole.integrations.Core.SendEmail({ to: NOTIFY_EMAIL, subject, body }).catch(() => {});
}

/** admin-only guard for the moderation functions: the caller must be logged in to the Base44 app as an admin */
export async function requireAdmin(base44: any) {
  const me = await base44.auth.me().catch(() => null);
  return me && me.role === 'admin' ? me : null;
}
