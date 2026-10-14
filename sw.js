/* Frutería Alicia — installable shell.
 *
 * Deliberately does ONE thing: keeps the page itself openable when the signal is bad.
 *
 * products.json is NEVER cached. The catalogue is the price list a customer is charged from, and
 * the page already fetches it with cache:"no-store" — a service worker serving a cached catalogue
 * would quote a price the shop no longer honours, silently, and the customer would be right.
 * Any request for the catalogue goes straight to the network, untouched.
 */
const SHELL = 'fa-shell-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon-180.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;
  if (/products\.json$/i.test(url.pathname)) return;   // catalogue: network only, always

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html').then(
        (r) => r || new Response('<h1>Sin conexión</h1><p>Abre de nuevo cuando tengas señal.</p>',
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } })))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req))
  );
});
