import type { APIRoute } from 'astro';
export const GET: APIRoute = () => new Response(JSON.stringify({
  name: 'מעשר+ · עשר כדי שתתעשר', short_name: 'עשר כדי שתתעשר', lang: 'he', dir: 'rtl', start_url: './', display: 'browser',
  background_color: '#F8F4EA', theme_color: '#F8F4EA',
  icons: [{ src: 'icon/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' }, { src: 'icon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
}), { headers: { 'Content-Type': 'application/manifest+json' } });
