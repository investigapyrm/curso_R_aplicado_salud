# Bitácora

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
