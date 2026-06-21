const CACHE_NAME = 'reidblog-v1';

// 预缓存关键页面
const PRECACHE_URLS = [
  '/',
  '/posts/',
  '/posts/exam_relay/',
  '/about/',
  '/categories/',
  '/tags/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 只拦截 GET 请求
  if (event.request.method !== 'GET') return;

  // 不缓存管理后台和分析请求
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/') || url.searchParams.has('admin')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 从网络获取并更新缓存
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });

      // 缓存优先：有缓存用缓存，同时后台更新
      return cached || fetchPromise;
    })
  );
});
