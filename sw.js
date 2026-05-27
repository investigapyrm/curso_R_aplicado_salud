const CACHE_NAME = 'r-salud-v20260526-2';

const APP_SHELL = [
  './',
  './index.html',
  './entrar.html',
  './dashboard.html',
  './documentos.html',
  './config.js',
  './js/api.js',
  './js/app.js',
  './css/styles.css',
  './css/styles-template.css',
  './css/documentos.css',
  './manifest.json',
  './icons/logo-r-salud.svg',
  './icons/unit-1.svg',
  './icons/unit-2.svg',
  './icons/unit-3.svg',
  './icons/unit-4.svg',
  './assets/pedagogical/edu_u1s2_rstudio.svg',
  './assets/pedagogical/edu_u1s2d_tipos_objetos_r.svg',
  './assets/pedagogical/edu_u1s3_pipeline.svg',
  './assets/pedagogical/edu_u2s1_grammar_graficos.svg',
  './assets/pedagogical/edu_u2s1d_guia_graficos.svg',
  './assets/pedagogical/edu_u2s2_boxplot.svg',
  './assets/pedagogical/edu_u2s2d_distribuciones.svg',
  './assets/pedagogical/edu_u2s3_correlacion.svg',
  './assets/pedagogical/edu_u3s1_knn.svg',
  './assets/pedagogical/edu_u3s1d_bias_variance.svg',
  './assets/pedagogical/edu_u3s2_sigmoide.svg',
  './assets/pedagogical/edu_u3s2d_feature_encoding.svg',
  './assets/pedagogical/edu_u3s3_roc_confusion.svg',
  './assets/pedagogical/edu_u4s1_shap.svg',
  './assets/pedagogical/edu_u4s1d_arbol_decision.svg',
  './assets/pedagogical/edu_u4s2_rmarkdown.svg',
  './assets/pedagogical/edu_u4s2d_validacion_cruzada.svg',
  './assets/pedagogical/edu_u4s3_sesgo_algoritmico.svg',
  './assets/pedagogical/gen_all_data.svg',
  './assets/pedagogical/gen_business_analytics.svg',
  './assets/pedagogical/gen_education.svg',
  './assets/pedagogical/u1_cloud_hosting.svg',
  './assets/pedagogical/u1_data.svg',
  './assets/pedagogical/u1_data_input.svg',
  './assets/pedagogical/u1_data_processing.svg',
  './assets/pedagogical/u1_developer.svg',
  './assets/pedagogical/u2_analytics.svg',
  './assets/pedagogical/u2_charts.svg',
  './assets/pedagogical/u2_dashboard.svg',
  './assets/pedagogical/u2_data_points.svg',
  './assets/pedagogical/u2_data_trends.svg',
  './assets/pedagogical/u2_research.svg',
  './assets/pedagogical/u2_statistics.svg',
  './assets/pedagogical/u3_ai.svg',
  './assets/pedagogical/u3_code_review.svg',
  './assets/pedagogical/u3_data_reports.svg',
  './assets/pedagogical/u4_data_report.svg',
  './assets/pedagogical/u3_predictive.svg',
  './assets/pedagogical/u3_programming.svg',
  './assets/pedagogical/u3_solution.svg',
  './assets/pedagogical/u4_analyze.svg',
  './assets/pedagogical/u4_data_extraction.svg',
  './assets/pedagogical/u4_knowledge.svg',
  './assets/pedagogical/u4_presentation.svg',
  './assets/pedagogical/u4_security.svg',
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
  './data/quizzes/quiz_u7.json',
  './data/quizzes/quiz_u8.json',
  './unidades/unidad7/material.html',
  './recursos/notebooklm/indice.json',
  './recursos/notebooklm/contenido_fichas.json',
  './docs/plan_integracion_notebooklm.html',
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

  const requestUrl = new URL(event.request.url);
  const networkFirst = event.request.mode === 'navigate'
    || requestUrl.pathname.endsWith('/data/usuarios.json')
    || requestUrl.pathname.endsWith('/config.js')
    || requestUrl.pathname.endsWith('/js/api.js');

  if (networkFirst || event.request.cache === 'no-store') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok && event.request.cache !== 'no-store') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

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
