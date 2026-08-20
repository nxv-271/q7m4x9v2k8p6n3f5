// 大阪2027 旅行小工具 - Service Worker
// v5：切換主要行程／逛街地圖為 9:16 手機直式版。
const CACHE_NAME = 'osaka2027-v5';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/favicon-32.png',
  './assets/d1_mobile.png',
  './assets/d2_flag.png',
  './assets/d2_meeting.jpg',
  './assets/d3_umeda_mobile.png',
  './assets/d4_fushimi_mobile.png',
  './assets/d4_kiyomizu_mobile.png',
  './assets/d4_tsutenkaku_mobile.png',
  './assets/d5_rinku_1f.png',
  './assets/d5_rinku_2f3f.png',
  './assets/itinerary_mobile.png'
];

// 保留 index.html 原本檔名，同時讓舊連結自動導向新版直式圖片。
const MOBILE_IMAGE_MAP = {
  '/assets/d1.png': './assets/d1_mobile.png',
  '/assets/d3_umeda.png': './assets/d3_umeda_mobile.png',
  '/assets/d4_fushimi.png': './assets/d4_fushimi_mobile.png',
  '/assets/d4_kiyomizu.png': './assets/d4_kiyomizu_mobile.png',
  '/assets/d4_tsutenkaku.png': './assets/d4_tsutenkaku_mobile.png',
  '/assets/overview.png': './assets/itinerary_mobile.png'
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '');
  const relativePath = url.pathname.startsWith(scopePath) ? url.pathname.slice(scopePath.length) : url.pathname;
  const mobileTarget = MOBILE_IMAGE_MAP[relativePath];
  if (mobileTarget) {
    event.respondWith(
      caches.match(mobileTarget).then((cached) => cached || fetch(mobileTarget))
    );
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});
