// 大阪2027 旅行小工具 - Service Worker
// v6：最終介面優化＋9:16 手機直式地圖。
const CACHE_NAME = 'osaka2027-v8';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/favicon-32.png',
  './assets/itinerary_mobile.png',
  './assets/d1_mobile.png',
  './assets/d2_flag.png',
  './assets/d2_meeting.jpg',
  './assets/d3_umeda_mobile.png',
  './assets/d4_fushimi_mobile.png',
  './assets/d4_kiyomizu_mobile.png',
  './assets/d4_tsutenkaku_mobile.png',
  './assets/d5_rinku_1f.png',
  './assets/d5_rinku_2f3f.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req, { cache: 'no-store' }).then((res) => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
      }
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(caches.match(req).then((cached) => {
    if (cached) return cached;
    return fetch(req).then((res) => {
      if (res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
      }
      return res;
    });
  }));
});
