# Manual técnico

## Tipo de aplicación

Sitio estático publicable en GitHub Pages con backend Google Apps Script y Google Sheets.

## Archivos principales

- `index.html`: login con Apps Script y respaldo local de práctica.
- `dashboard.html`: shell del aula virtual.
- `config.js`: IDs de Sheet, Apps Script, Drive y versión.
- `js/api.js`: JSONP/POST, cola offline, login, sincronización y subida de evidencias.
- `js/app.js`: ruta secuencial, foros, calendario, quizzes, evidencias y progreso.
- `apps-script/Code.js`: backend para Sheets y Drive.
- `data/usuarios.json`: usuarios demo.
- `data/quizzes/`: cuestionarios autocorregibles.
- `data/datasets/salud_muestra.csv`: dataset ficticio.
- `manifest.json` y `sw.js`: instalación PWA y cache básico.

## Backend

Sheet:

`1mlgNE-pDQZuAuUNj524dHn-zF9cbYvv6a6shvTDDtTg`

Apps Script:

`12qxXJci0JxfJTPEdxPfMw_bTlUTHBUHK2rtcRenpF-RbODAg8FhCYWwC`

Drive:

`1g5rmr_z3wo2JbkPD4GGl3EhvC-Jq1E6v`

Para subir backend:

```powershell
cd "G:\Mi unidad\UNICONCEP_cursos\curso_R_en_salud\apps-script"
clasp push -f
clasp deploy -d "R salud backend"
```

Luego copiar la URL `/exec` nueva en `config.js`.

## Publicación frontend

1. Subir cambios a la rama `main`.
2. Activar GitHub Pages desde `main` y carpeta raíz.
3. Probar `index.html`, `dashboard.html`, quizzes y enlaces de unidad.

## Seguridad

El login local es solo respaldo pedagógico. El acceso inicial publicado es `admin` / `123456`, sin dependencia del correo. Si se actualiza el backend de Apps Script y se quiere forzar la misma credencial en la hoja `USUARIOS`, ejecutar una vez `resetAdminAccess()` desde el editor de Apps Script.

En producción, administrar usuarios desde la hoja `USUARIOS` con hash SHA-256 y evitar datos reales de pacientes. Las evidencias deben ser material académico o datos anonimizados.

## Actualización de contenidos

Editar las unidades en `dashboard.html` y las páginas HTML dentro de `unidades/unidadN/`. Los cuestionarios se editan en JSON.
