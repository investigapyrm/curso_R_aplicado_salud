const CACHE_NAME = 'r-salud-v20260522-2';

const APP_SHELL = [
  './',
  './index.html',
  './dashboard.html',
  './config.js',
  './js/api.js',
  './js/app.js',
  './css/styles.css',
  './manifest.json',
  './icons/logo-r-salud.svg',
  './data/usuarios.json',
  './data/course.json',
  './data/datasets/salud_muestra.csv',
  './data/quizzes/quiz_u1.json',
  './data/quizzes/quiz_u2.json',
  './data/quizzes/quiz_u3.json',
  './data/quizzes/quiz_u4.json',
  './data/quizzes/quiz_u5.json',
  './data/quizzes/quiz_u6.json',
  './guia_didactica/index.html',
  './laboratorio/index.html',
  './practicas/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
