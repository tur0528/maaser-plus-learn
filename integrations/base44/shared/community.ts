// Shared helpers for the community functions. Base44 lets functions import from base44/shared/.
// Put this file in base44/shared/community.ts and import it from each function,
// or paste its contents at the top of each function if shared imports are not available.
export const ALLOWED_ORIGINS = [
  'https://learn.maaser-plus.com', // ← the content site's final address (change when the subdomain is chosen)
  'http://localhost:4321',         // local preview
];
export const NOTIFY_EMAIL = 'OR_EMAIL_PLACEHOLDER'; // ← Or's email for "new item waiting for approval"
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
