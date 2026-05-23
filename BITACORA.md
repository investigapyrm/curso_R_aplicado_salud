# Bitácora

## 2026-05-22 - Ruta de unidades en diapositivas

- Problema reportado: el aula mejoró, pero aún no replica la calidad, formas y estilos del ejemplo; el contenido debía avanzar como diapositivas con transición.
- Se transformó la unidad activa en un deck pedagógico con transición horizontal: portada, concepto, caso clínico, práctica ejecutable, evidencia/foro y cierre.
- Se agregaron 14 diapositivas por unidad, con avance secuencial, bloqueo por subnivel, contador, rail de navegación y estado completado.
- Cada práctica ejecutable incluye código R base compatible con WebR, botón para ejecutar en pantalla completa y carga opcional de WebR dentro de la diapositiva.
- Se mantuvieron tareas, cuestionarios, foros, evidencias y progreso existentes, evitando romper la estructura de backend y PWA.
- Versión de app/cache actualizada a `2026.05.22.5`.
- Validación local viva: Chrome headless vía CDP abrió `dashboard.html#unidad`, detectó 14 diapositivas, verificó cambio de `transform` al avanzar y cargó un iframe WebR dentro de la diapositiva de práctica ejecutable.
- Validación móvil local: viewport 390x844 cargó la unidad con 14 diapositivas, ancho visible de slide 354 px y navegación móvil activa.
- Validación pública: GitHub Pages sirvió `dashboard.html`, `js/app.js`, `css/styles.css` y `sw.js` con `20260522-5`; Chrome headless abrió `https://investigapyrm.github.io/curso_R_aplicado_salud/dashboard.html#unidad`, detectó 14 diapositivas y verificó transición al avanzar.

## 2026-05-22 - Laboratorio WebR desde archivos del ejemplo

- Se adopto el patron del laboratorio ejecutable del curso ejemplo: editor, boton Ejecutar, salida en pantalla, fichas cargables y modo embebido.
- Se reemplazo `laboratorio/index.html` por una version R pura con WebR, sin Python ni Pyodide, usando `data/datasets/salud_muestra.csv`.
- Se reemplazo `practicas/index.html` por fichas guiadas adaptadas a salud con enlace directo para ejecutar cada bloque en WebR.
- Se actualizo `dashboard.html` y `js/app.js` para embeber el laboratorio ejecutable dentro del aula.
- Version de app/cache actualizada a `2026.05.22.4`.
- Validacion viva local: Playwright ejecuto `1 + 1` en `laboratorio/index.html` y WebR devolvio `[1] 2`; el dashboard embebido cargo `.lab-frame` en la seccion Laboratorio.
- Validacion publica: GitHub Pages sirvio la version `20260522-4` y Playwright ejecuto `1 + 1` en `https://investigapyrm.github.io/curso_R_aplicado_salud/laboratorio/index.html`, devolviendo `[1] 2`.

## 2026-05-22 - Replica ampliada del aula ejemplo

- Problema reportado: el aula seguia viendose pobre frente al curso ejemplo `analiticabigdata`.
- Se incorporo un modo de unidad tipo cuaderno de aprendizaje: hero visual, tabs por unidad, secuencia por subniveles, microclase, foro guiado, codigo R, evidencia esperada y enlaces a practica.
- Se agregaron modulos nuevos en el dashboard: `Prácticas guiadas`, `Flashcards` y `Clasificador`.
- Se amplio `data/course.json` con figuras pedagogicas, 6 laboratorios guiados, 18 fichas practicas, 12 flashcards y 3 clasificadores conceptuales.
- Se copiaron y cachearon laminas SVG pedagogicas desde el proyecto ejemplo en `assets/pedagogical/`.
- Se actualizo version de app/cache a `2026.05.22.3`.
- Validaciones ejecutadas: `node --check js/app.js`, parseo JSON de `data/course.json`, `node --check sw.js`, HTTP 200 en `http://localhost:8765/dashboard.html`.
- Validacion visual local con Playwright: capturas QA de Inicio, Unidad activa, Practicas, Flashcards y Clasificador renderizaron selectores esperados.
- Commit publicado: `eb0d016 Enriquecer aula R salud tipo curso ejemplo`.
- GitHub Pages verificado: `dashboard.html`, `js/app.js`, `data/course.json` y `assets/pedagogical/edu_u1s2_rstudio.svg` responden 200 con el contenido nuevo.
- Pendiente externo: el Apps Script sigue requiriendo permiso efectivo sobre la planilla para que el backend remoto deje de responder acceso denegado.

## 2026-05-22 - Reintento de publicacion

- Commit de reconfiguracion subido: `a4182a4 Reconfigurar aula R salud avanzada`.
- Publicacion GitHub: `origin/main` quedo sincronizado con la rama local tras reintentar el push.

## 2026-05-22

- Objetivo: duplicar la idea del aula web `analiticabigdata` y adaptarla a un curso autogestionado de R aplicado a salud.
- Carpeta destino: `G:\Mi unidad\UNICONCEP_cursos\curso_R_en_salud`.
- Repositorio destino: `https://github.com/investigapyrm/curso_R_aplicado_salud.git`.
- Estado inicial: carpeta vacía; se clonó el repositorio remoto, que estaba vacío.
- Decisión: crear una primera versión limpia y estática, con foco exclusivo en R, salud, inferencia básica y publicación en RPubs.
- Validación local: JSON de usuarios/cuestionarios parsea correctamente; `index.html`, `dashboard.html`, CSS, manifest y rutas de unidad responden 200 en servidor local `http://localhost:8765/`.
- Commit local inicial creado: `113ef12 Crear aula R aplicado a salud`.
- Bloqueo de publicación: `git push -u origin main` falló con 403 porque GitHub denegó escritura a la cuenta local `diegomezapy` sobre `investigapyrm/curso_R_aplicado_salud.git`.
- Pendiente operativo: otorgar permiso de escritura a `diegomezapy` o ejecutar el push con una cuenta/token con permisos sobre `investigapyrm`.

## 2026-05-22 - Reconfiguración avanzada

- Problema reportado: la primera versión se veía pobre frente al aula `analiticabigdata`.
- Se reemplazó el dashboard por una arquitectura modular con `config.js`, `js/api.js`, `js/app.js` y `data/course.json`.
- Se agregaron ruta secuencial, subniveles, bloqueos pedagógicos, calendario, foros, evidencias, laboratorio R, progreso, logros y administración.
- Se creó backend Apps Script en `apps-script/Code.js` para `CONFIG`, `USUARIOS`, `SESIONES`, `PROGRESO`, `CALIFICACIONES`, `EVENTOS`, `FOROS`, `CALENDARIO`, `EVIDENCIAS`, `ERRORES`, `VERSIONES`.
- Apps Script asociado: `12qxXJci0JxfJTPEdxPfMw_bTlUTHBUHK2rtcRenpF-RbODAg8FhCYWwC`.
- Deployment creado: `AKfycbxxKpSzXV1u5bhOTMd9Z716MtcGS7naJ2bLsdCx_F2ScDlIPDhdnaiCWvGLcaa7-jRu`.
- Google Sheet configurado vía conector con hojas técnicas y datos semilla: `1mlgNE-pDQZuAuUNj524dHn-zF9cbYvv6a6shvTDDtTg`.
- Carpeta Drive para evidencias configurada: `1g5rmr_z3wo2JbkPD4GGl3EhvC-Jq1E6v`.
- Bloqueo vigente: el endpoint Apps Script devuelve acceso denegado al abrir la planilla; se requiere conceder permiso de edición al usuario que ejecuta el deployment o redeployar desde una cuenta con acceso al Sheet.
- Commit local de esta reconfiguración: `Reconfigurar aula R salud avanzada` (ver `git log --oneline -1` para hash exacto).
- Publicación GitHub pendiente: `git push -u origin main` no pudo completarse desde esta sesión; con prompts deshabilitados Git informó que no podía leer usuario para `https://github.com`. El remoto tiene `main` en `113ef12`, por lo que falta subir este commit.
