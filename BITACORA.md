# Bitácora

## 2026-05-28 - Ensayo R particionado y evaluación separada

- Problema reportado: el ensayo R no dejaba ejecutar con claridad y mezclaba codigo, resultados y cuestionario en una sola vista.
- Se particiono el ensayo en subpartes: leer tabla, revisar campos, pruebas de una muestra, comparacion de grupos y evaluacion.
- Cada subparte carga un bloque corto de codigo R y el boton ejecuta solo ese paso en WebR.
- Se agrego un boton de ejecucion junto al editor para correr el codigo ahi mismo.
- El cuestionario de evaluacion paso a una subvista propia dentro del ensayo.
- Se agregaron estados de ejecucion mas claros y un mensaje especifico si WebR no puede cargarse por conexion, bloqueo de scripts o vista embebida.
- Se actualizo cache/versionado a `2026.05.28.2`.

## 2026-05-28 - Ensayo RStudio/WebR con datos del aula

- Se agrego a la practica inicial una pestaña `Ensayo R` que toma los datos del Google Sheet, arma un CSV para R y permite ejecutar pruebas de hipotesis en WebR dentro de la vista.
- Se incorporo una muestra simulada minima para ensayar inferencia cuando aun hay pocas respuestas reales, con opcion local y opcion para guardar filas simuladas en el Sheet.
- El script R editable incluye resumen descriptivo, t de una muestra, prueba de una proporcion, comparacion de IMC por sexo y chi-cuadrado para categorias.
- Se agrego reporte automatico imprimible/exportable a Word y un cuestionario breve con puntaje y retroalimentacion.
- Se actualizo cache/versionado a `2026.05.28.1`.

## 2026-05-27 - Corrección URL Apps Script práctica inicial

- Problema reportado: la práctica inicial mostraba `No se pudo contactar Apps Script` y usaba datos locales del navegador.
- Se cambio `initialPracticeAppsScriptUrl` al deployment funcional `AKfycbzh9lWdhd7KrDzJX1TULGDZkNCg7Vj_DlbVzPkKNnINVhN2bp-dB9iSYOpogLI509Z8`.
- Se verifico que `action=ping` y `action=list` respondan `status: ok` desde el endpoint nuevo.
- Se actualizo cache/versionado a `2026.05.27.13`.

## 2026-05-27 - Práctica inicial con QR y tablero vivo

- Se agrego `practica_inicial/index.html`, una miniapp de aula con cuestionario de variables basicas de salud, QR proyectable, tablero global, filtros, tabla ordenable y exportaciones Word/Excel.
- Se creo `apps-script-practica-inicial/` conectado al Sheet `1PtQGtn_ex9ShQxu9p5YVXFFZd6FGz3N5aLjv9p9uoqY`, con acciones `setup`, `save`, `list` y `stats`.
- Se incorporo la practica como boton nuevo del dashboard y como vista embebida redimensionable para usarla sin salir del aula.
- Se agregaron enlaces directos para abrir cuestionario, proyectar QR, ver resultados y abrir la planilla.
- Se actualizo cache/versionado a `2026.05.27.12`.
- Deployment Apps Script publicado como version `@4`, pero la prueba anonima devuelve `Acceso denegado`; falta confirmar en la consola de Apps Script que el web app quede con acceso publico anonimo.

## 2026-05-27 - Acceso por cuenta personal

- Problema reportado: la app web mostraba una credencial publica `admin / 123456`, inadecuada para estudiantes.
- Se elimino la credencial visible de la pantalla de acceso y se vacio la nomina publica `data/usuarios.json`.
- Se agrego registro de cuenta personal desde `index.html`, con usuario, nombre, correo opcional, contraseña y frase de recuperacion.
- Se agrego recuperacion de contraseña usando usuario, correo registrado si existe y frase de recuperacion.
- El login ahora valida primero cuentas locales con contraseña hasheada en el navegador y conserva el progreso por usuario.
- Se actualizaron README y manual de usuario para describir el nuevo flujo.
- Se actualizo cache/versionado a `2026.05.27.10`.

## 2026-05-27 - Scroll libre y paneles redimensionables

- Problema reportado: la navegacion con scroll fallaba en varias zonas y el usuario necesitaba ajustar anchos estirando bloques.
- Se habilito scroll vertical natural en modo unidad, evitando que `body`, `main-content` o `page-content` bloqueen el desplazamiento.
- Se agregaron manijas de arrastre para ajustar el ancho del panel derecho de unidad y del panel de lista de recursos.
- Se guardan los anchos elegidos en el navegador para conservar la preferencia.
- Se habilito `resize` y `overflow:auto` en bloques de contenido, tarjetas, lectores y paneles principales.
- Se actualizo cache/versionado a `2026.05.27.9`.

## 2026-05-27 - Imagenes editoriales integradas por unidad

- Se incorporaron las 19 imagenes del paquete `curso_r_salud_19_imagenes.zip` como WebP optimizados en `recursos/imagenes/unidad1..8/`.
- Se insertaron figuras hero y conceptuales en los materiales HTML de las 8 unidades, con `alt`, `figcaption` y carga diferida.
- Se ajustaron los materiales compactos de unidades 1 a 6 y 8 para que las imagenes queden junto al contenido curricular correcto.
- Se agregaron estilos globales para figuras documentales en `css/styles.css`.
- Se agregaron los nuevos WebP al service worker y se actualizo cache/versionado a `2026.05.27.8`.

## 2026-05-27 - Jerarquia clara del panel derecho

- Problema reportado: algunos elementos del panel derecho se solapaban y no quedaba clara la relacion entre niveles, subniveles y contenidos.
- Se reemplazo la navegacion paralela de subniveles/pasos por una jerarquia anidada: Unidad -> Subnivel -> Pasos.
- Cada subnivel contiene visualmente sus pasos, con borde lateral, indentacion y estados activo/completado/bloqueado.
- Se ajusto el espaciado interno del panel para evitar superposiciones en textos largos.
- Se actualizo cache/versionado a `2026.05.27.7`.

## 2026-05-27 - Panel lateral plegable en unidades

- Problema reportado: la vista de unidad seguia perdiendo demasiado espacio con acciones superiores, tabs, subniveles y lista de pasos antes del contenido.
- Se reorganizo la vista en un area principal de contenido y un panel lateral derecho.
- El panel lateral agrupa Inicio, Ruta, Materiales, Actividades, Practica, Quiz, Recursos e Info, mas el avance, subniveles y pasos cuando se esta en Ruta.
- Se agrego un boton `Panel` para ocultar o mostrar el lateral; la preferencia queda guardada en el navegador.
- Se ocultaron titulo y acciones de la barra superior dentro de las unidades para liberar altura util.
- La ficha activa, recursos embebidos y lector mantienen scroll interno sin forzar desplazamiento vertical general.
- Se corrigieron etiquetas residuales de Recursos NLM que aun llamaban `JSON` a materiales HTML internos.
- Se actualizo cache/versionado a `2026.05.27.6`.

## 2026-05-27 - Scroll interno y recursos integrados solo HTML

- Problema reportado: la vista compacta ya no permitia desplazamiento vertical dentro de las fichas, y aun aparecian recursos integrados con aspecto de Word/texto crudo.
- Se cambio la ficha activa para permitir `overflow-y: auto` dentro del panel de contenido, manteniendo la pantalla general sin scroll vertical innecesario.
- Se dejo de insertar `indice.json`, `quiz_uX.json`, Markdown o Google Docs como recursos embebidos en Materiales, Actividades y Ruta.
- `buildNotebookUnitFiles()` ahora construye recursos desde `unidades/unidadX/material.html`, `orientaciones.html`, `actividad.html` y `tarea.html`.
- La ruta secuencial tambien usa `unidades/unidadX/material.html` como recurso integrado, en vez de `unit.url` de Google Docs.
- Se agregaron HTML internos faltantes para Unidad 7 y Unidad 8: orientaciones, actividad y tarea; y material completo de Unidad 8.
- Se agregaron los HTML de unidades 1 a 8 al service worker para cachearlos como recursos del aula.
- Se actualizo cache/versionado a `2026.05.27.3`.
- Validaciones locales: sintaxis del JS embebido, parseo JSON, `bodyScroll: 0`, `overflow-y: auto` en ficha activa y cero recursos embebidos `.json`, `.md` o `docs.google.com` en Materiales/Actividades de unidades 1, 7 y 8.

## 2026-05-27 - Rediseño compacto de vistas del aula

- Problema reportado: varias vistas desperdiciaban espacio vertical y horizontal con elementos redundantes, como el circulo conceptual gigante, el titulo de unidad repetido y bloques con bajo contraste.
- Se elimino el encabezado grande de unidad dentro de la vista de detalle; la unidad ya queda indicada en el panel lateral.
- Se compacto la barra de tabs de unidad y se acortaron etiquetas para reducir altura y ruido visual.
- Se reemplazo el circulo conceptual gigante por una banda compacta con codigo de subnivel y titulo.
- Se redistribuyeron las tarjetas con ilustracion para que el contenido textual tenga prioridad y la imagen quede como apoyo.
- Se ajustaron alturas de ruta, tarjeta activa, recursos embebidos y lector para evitar scroll vertical de pantalla en la ruta secuencial.
- Se mejoro contraste entre fondo, paneles, tarjetas de conceptos, definiciones y chips de terminos usando blancos, grises frios y bordes mas definidos.
- Se actualizo cache/versionado a `2026.05.27.2`.
- Validaciones locales: sintaxis del JS embebido en `dashboard.html`, parseo JSON y prueba headless autenticada en `dashboard.html#u1` con `bodyScroll: 0`, sin `unit-detail-header` y marcador visual de 38 px de alto.

## 2026-05-26 - Compactacion del lector y plan en HTML

- Problema reportado: el plan de integracion seguia viendose como Markdown crudo dentro del aula (`#`, `##`, listas sin maquetar), y las barras/titulos de los lectores ocupaban demasiado espacio.
- Se creo `docs/plan_integracion_notebooklm.html` como version HTML interna del plan.
- Se reemplazaron las referencias de orientaciones y biblioteca desde `docs/plan_integracion_notebooklm.md` hacia el HTML.
- Se compacto el lector de recursos: panel lateral mas angosto, botones/lista mas densos, toolbar de lectura mas baja e iframe con mayor alto util.
- Se compacto tambien el encabezado de recursos integrados dentro de la ruta secuencial para priorizar el contenido embebido.
- Se actualizo cache/versionado a `2026.05.26.2`.
- Validaciones locales: parseo JSON, sintaxis del JS embebido en `dashboard.html`, `tidy` sobre `docs/plan_integracion_notebooklm.html` y `unidades/unidad7/material.html`.

## 2026-05-26 - Recurso integrado HTML para Unidad 7

- Problema reportado: el recurso "Documento NotebookLM - Unidad 7" aparecia como un documento externo incrustado, con aspecto de Markdown pegado en Word, y no como contenido propio del aula.
- Decision aplicada: reemplazar el recurso principal de la Unidad 7 por un HTML interno del aula, embebible en la ruta secuencial y en la seccion de materiales.
- Se creo `unidades/unidad7/material.html` con lectura, objetivos, ensayos en R, lectura de modelos y limitaciones.
- Se actualizo `dashboard.html` para que la Unidad 7 apunte a `unidades/unidad7/material.html` y muestre "Material integrado - Unidad 7" en vez de "Documento NotebookLM - Unidad 7" cuando el recurso es local.
- Se actualizo `recursos/notebooklm/indice.json` y `documentos.html` para enlazar el HTML interno, conservando el Google Doc original como `sourceUrl` de referencia.
- Se actualizo cache/versionado a `2026.05.26.1` y se agrego el HTML nuevo al service worker.
- Validaciones locales: parseo de JSON, sintaxis del JS embebido de `dashboard.html` y `tidy` sobre `unidades/unidad7/material.html`.
- Publicacion GitHub: commit `5bc7ee9 Integrar recurso HTML de unidad 7` empujado a `origin/main`.
- Validacion publica con cache-busting: `dashboard.html`, `recursos/notebooklm/indice.json` y `unidades/unidad7/material.html` responden desde GitHub Pages con la ruta HTML interna.

## 2026-05-23 - Reset contra cache de acceso viejo

- Problema reportado: el sitio muestra una pantalla que solo pide contrasena y responde "Contrasena incorrecta para el paquete de datos publicado" al usar `123456`.
- Hallazgo: esa frase no existe en los archivos actuales del curso, por lo que probablemente viene de una version cacheada o de una capa heredada de la plantilla.
- Se agrego `entrar.html` para limpiar `sessionStorage`, service workers y Cache Storage antes de redirigir al login actual.
- Se actualizo `index.html` para aceptar `?reset=20260523-3`, reiniciar la sesion local y forzar usuario `admin`.
- Se subio la version de frontend/cache a `2026.05.23.3` y `r-salud-v20260523-3`.
- Se actualizaron `README.md` y `docs/manual_usuario.md` con la ruta de recuperacion.

## 2026-05-23 - Reinicio simple de acceso

- Problema reportado: el flujo dependiente de correo no funciona y no llega nada al correo.
- Decision operativa: reiniciar el aula con acceso directo `admin` / `123456`, sin depender de correo ni recordatorios.
- Se actualizo `data/usuarios.json` para dejar solo el usuario local `admin` con rol docente.
- Se actualizo la portada de login para mostrar `admin` / `123456` y evitar que un usuario anterior guardado en el navegador reemplace ese acceso inicial.
- Se actualizo `js/api.js` para validar primero el usuario local, pedir `usuarios.json` con version de app y evitar credenciales viejas servidas desde cache.
- Se actualizo `sw.js` a `r-salud-v20260523-2` y se agrego estrategia network-first para `index`, `config.js`, `js/api.js` y `data/usuarios.json`.
- Se agrego `resetAdminAccess()` en `apps-script/Code.js` y se ajusto `seedUsers_()` para crear o reparar el usuario `admin` / `123456` en la hoja `USUARIOS` cuando se despliegue el backend.
- Se actualizaron `README.md`, `docs/manual_usuario.md` y `docs/manual_tecnico.md`.
- Apps Script fue empujado con `clasp push -f` y el deployment activo quedo en `@6`; la URL publica del backend sigue devolviendo 403 de permisos de Google, por lo que el login queda resuelto por fallback local primero.
- Validaciones locales: `node --check` en `js/api.js`, `sw.js` y `apps-script/Code.js`; parseo de `data/usuarios.json`; prueba automatizada de `RSaludAPI.login('admin', '123456')` confirmo `source: local` y rol `docente` sin llamada al backend.
- Validacion publica con cache-busting: `index.html`, `config.js`, `js/api.js`, `data/usuarios.json` y `sw.js` respondieron 200 y mostraron los marcadores `admin`, `123456` y `20260523-2`.
- Validacion publica automatizada: `RSaludAPI.login('admin', '123456')` cargo desde GitHub Pages y confirmo `source: local`, rol `docente` y cero llamadas al backend.

## 2026-05-23 - Migracion operativa a 8 unidades NotebookLM

- Objetivo: proceder con la integracion real de los recursos NotebookLM dentro del aula.
- Se migro el dashboard de 4 unidades visuales a 8 unidades secuenciales alineadas con los documentos de Google Docs.
- Se agrego la navegacion lateral para unidades 5 a 8 y se actualizaron rutas `#u1` a `#u8`.
- Se activo `recursos/notebooklm/indice.json` y se creo `recursos/notebooklm/contenido_fichas.json` para alimentar ideas, ejemplos y fichas dentro de las diapositivas.
- Se generaron 8 laboratorios WebR, uno por unidad, y 24 subniveles derivados del curriculo NotebookLM.
- Se reemplazaron los cuestionarios por `quiz_u1.json` a `quiz_u8.json`, cada uno con 10 preguntas y retroalimentacion.
- Se ajustaron las laminas pedagogicas visibles para que unidades 2 a 8 ya no hereden contenidos de ML/SHAP del curso ejemplo.
- Se extendio el clasificador interactivo a las 8 unidades, con categorias y casos propios de R aplicado a salud.
- Se actualizo `data/course.json`, `documentos.html`, `README.md`, `index.html`, `config.js`, `sw.js` y el CSS de la plantilla para reflejar 8 semanas, 24 subniveles y 8 quizzes.
- Validaciones locales: sintaxis del JS inline de `dashboard.html`, `node --check sw.js`, `node --check js/app.js`, parseo de `data/course.json`, `indice.json`, `contenido_fichas.json` y `quiz_u1.json` a `quiz_u8.json`.
- Validacion PWA local: `sw.js` no referencia archivos faltantes e incluye `quiz_u7.json`, `quiz_u8.json`, `indice.json` y `contenido_fichas.json`.
- Validacion local viva con Chrome CDP: `dashboard.html#u8` cargo con 8 unidades en el menu, 3 subniveles en unidad 8, 24 fichas NotebookLM, recurso NotebookLM visible y contenido RPubs.
- Validacion local de cuestionario: `startQuiz(8)` cargo `quiz_u8.json` con 10 preguntas.
- Validacion local de clasificador: `renderMatching(8)` mostro 8 tabs, 10 casos y 5 zonas para "Reporte reproducible y RPubs".
- Se agrego `.github/workflows/pages.yml` para publicar automaticamente el sitio estatico desde `main` mediante GitHub Pages Actions.
- Commit de migracion publicado: `45d13e5 Migrar aula a 8 unidades NotebookLM`.
- Commit de despliegue publicado: `c4ff9af Agregar despliegue GitHub Pages`.
- GitHub Actions/Pages: workflows de Pages completados con `success` para `c4ff9af`.
- Validacion publica HTTP con cache-busting: `index.html`, `dashboard.html`, `documentos.html`, `sw.js`, `recursos/notebooklm/contenido_fichas.json` y `data/quizzes/quiz_u8.json` respondieron 200.
- Validacion publica viva con Chrome CDP: `dashboard.html#u8` abrio en `https://investigapyrm.github.io/curso_R_aplicado_salud/`, mostro 8 unidades, cargo 24 fichas NotebookLM y `startQuiz(8)` cargo 10 preguntas.

## 2026-05-22 - Revision de recursos NotebookLM

- Problema reportado: revisar los recursos creados con NotebookLM y pensar como aprovecharlos en el curso.
- Se revisaron los 9 documentos de Google Docs: presentacion maestra y unidades 1 a 8.
- Hallazgo principal: los documentos ya contienen una arquitectura curricular completa, con resultados medibles, microclase, codigo R, actividad autonoma, foro, quiz, respuestas, rubrica, glosario, checklist y recursos complementarios por unidad.
- Decision pedagogica: usar estos documentos como fuente canonica del curso y no como anexos.
- Decision tecnica: preparar migracion del aula de 4 unidades visuales a 8 unidades reales, con slides secuenciales, WebR, quizzes, rubricas, foros y tareas por unidad.
- Se creo `docs/plan_integracion_notebooklm.md` con el mapa pedagogico-tecnico de integracion.
- Se creo `recursos/notebooklm/indice.json` con el inventario estructurado de los documentos, sus enlaces, entregables y componentes esperados.
- Pendiente recomendado: generar `contenido_fichas.json`, quizzes u1-u8 y migrar `dashboard.html`, `data/course.json` y `documentos.html` a la estructura de 8 unidades.

## 2026-05-22 - Migracion real desde plantilla del curso ejemplo

- Problema reportado: el aula seguia sin aprovechar plenamente la calidad, estructura y potencialidades del curso ejemplo.
- Decision aplicada: usar el `dashboard.html` del proyecto `analiticabigdata` como plantilla real del aula, no solo como referencia visual.
- Se migro la shell completa del ejemplo: sidebar, topbar, tarjetas de progreso, logros, calendario, comunidad, administracion, seguimiento docente, documentos y ruta secuencial tipo presentacion.
- Se conservo la portada/login actual y se agrego puente de sesion `abd_user` para que la plantilla copiada reconozca al usuario autenticado.
- Se adapto el dashboard a R aplicado a salud: configuracion del Sheet/AppScript/GitHub Pages, unidades, subniveles, practicas, laboratorio WebR, textos, enlaces y recursos oficiales.
- Se desactivo el indice NotebookLM viejo del curso Big Data para evitar que aparecieran fichas antiguas de Python/Polars; la ruta usa ahora los subniveles nuevos de R salud y queda lista para cargar recursos NotebookLM propios.
- Se convirtieron los comandos embebidos de las diapositivas a R base/WebR y se valido que el laboratorio embebido reciba codigo por URL.
- Se agregaron `css/styles-template.css`, `documentos.html`, `css/documentos.css`, iconos de unidades y laminas SVG usadas por la plantilla.
- Se limpio el copiado de recursos obsoletos no referenciados antes del commit.
- Version de app/cache actualizada a `2026.05.22.7`.
- Validaciones locales: sintaxis del JS inline de `dashboard.html`, `node --check sw.js`, `node --check js/app.js`, parseo de `data/course.json`, service worker sin archivos faltantes.
- Validacion local viva con Chrome CDP: `dashboard.html` cargo como "R aplicado a la salud", mostro calendario/comunidad/laboratorio, Unidad 1 renderizo 90 diapositivas, no mostro textos viejos de Big Data/Python y una diapositiva ejecutable cargo `laboratorio/index.html?embed=1&code=...`.
- Validacion local del laboratorio: `laboratorio/index.html?embed=1&code=1%20%2B%201` abrio en modo embebido y cargo el codigo `1 + 1`.
- Commit publicado: `78dd0c4 Migrar aula a plantilla del curso ejemplo`.
- Validacion publica HTTP: `index.html`, `dashboard.html`, `css/styles-template.css`, `sw.js` y `documentos.html` respondieron 200 con marcadores `20260522-7`.
- Validacion publica viva con Chrome CDP: `dashboard.html` en GitHub Pages cargo sidebar "R aplicado a la salud", las 4 unidades, 90 diapositivas en Unidad 1 y laboratorio embebido con `laboratorio/index.html?embed=1&code=...`, sin textos visibles de Big Data/Python.

## 2026-05-22 - Portada promocional del curso

- Problema reportado: la portada antes del login promovía virtudes técnicas de la app web en vez del curso.
- Se reescribió `index.html` para presentar la promesa académica: aprender R desde cero, analizar datos de salud y publicar un informe en RPubs.
- Se retiró del primer impacto la mención a Google Sheets, Apps Script, Drive y trazabilidad; esos aspectos quedan dentro del aula o documentación técnica.
- Se agregaron datos promocionales del curso: 6 unidades, 18 prácticas guiadas y proyecto final en RPubs.
- Se actualizó cache/versionado a `2026.05.22.6`.
- Validación pública: `index.html` en GitHub Pages muestra el nuevo H1 del curso, los tres datos promocionales y no muestra menciones técnicas en la portada previa al login.

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
