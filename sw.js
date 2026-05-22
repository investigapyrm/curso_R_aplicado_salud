const CACHE_NAME = 'r-salud-v20260522-3';

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
  './assets/pedagogical/edu_u1s2_rstudio.svg',
  './assets/pedagogical/edu_u1s2d_tipos_objetos_r.svg',
  './assets/pedagogical/edu_u2s2_boxplot.svg',
  './assets/pedagogical/edu_u2s2d_distribuciones.svg',
  './assets/pedagogical/edu_u2s3_correlacion.svg',
  './assets/pedagogical/edu_u4s2_rmarkdown.svg',
  './assets/pedagogical/gen_education.svg',
  './assets/pedagogical/u1_data.svg',
  './assets/pedagogical/u1_developer.svg',
  './assets/pedagogical/u2_charts.svg',
  './assets/pedagogical/u2_research.svg',
  './assets/pedagogical/u2_statistics.svg',
  './assets/pedagogical/u3_data_reports.svg',
  './assets/pedagogical/u4_data_report.svg',
  './assets/pedagogical/u4_presentation.svg',
  './assets/pedagogical/u4_sharing.svg',
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
