// מעשר+ · חיבור לשרת הקהילה (Base44 backend functions).
// ===== INTEGRATION POINT =====
// כשאור יקים את אפליקציית הקהילה ב־Base44 (ראו integrations/base44/README.md),
// מכניסים את הכתובת שלה ל־src/data/site.json → "community_api_base",
// למשל "https://maaser-community.base44.app". כל עוד השדה ריק, האתר מציג דוגמאות והטפסים לא שולחים.
import site from '../data/site.json';

export const API = (site.community_api_base || '').replace(/\/$/, '');
export const enabled = API.length > 0;

export async function call<T = any>(fn: string, body: Record<string, unknown>): Promise<T> {
  if (!enabled) throw new Error('not-configured');
  const r = await fetch(`${API}/functions/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.error) throw new Error(data.error || `HTTP ${r.status}`);
  return data as T;
}

export const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export const heDate = (iso: string) => { try { return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)); } catch { return ''; } };

/** wire a <form> to a backend function. honeypot field name="website" */
export function wireForm(form: HTMLFormElement, fn: string, build: (fd: FormData) => Record<string, unknown>, okMsg: string) {
  const status = form.querySelector<HTMLElement>('.form-status')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  if (!enabled) { btn.disabled = true; }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    const fd = new FormData(form);
    if (fd.get('website')) return; // bot
    if (!form.reportValidity()) return;
    btn.disabled = true;
    try {
      await call(fn, { ...build(fd), started_at: Number(form.dataset.t || 0) });
      form.reset();
      status.textContent = okMsg; status.className = 'form-status ok';
    } catch (err: any) {
      status.textContent = err.message === 'not-configured' ? 'הטופס עוד לא מחובר לשרת (מצב תצוגה).' : 'משהו השתבש בשליחה. נסו שוב בעוד רגע.';
      status.className = 'form-status err';
    } finally { btn.disabled = !enabled; }
  });
  form.dataset.t = String(Date.now());
}
