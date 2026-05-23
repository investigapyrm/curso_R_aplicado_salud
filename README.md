# R aplicado a la salud

Aula virtual autogestionada para estudiantes de medicina y ciencias de la salud que quieren aprender R desde cero y publicar un primer informe reproducible en RPubs.

Repositorio destino: <https://github.com/investigapyrm/curso_R_aplicado_salud>

GitHub Pages esperado: <https://investigapyrm.github.io/curso_R_aplicado_salud/>

## Objetivo

Guiar a una persona sin experiencia previa desde la instalación de R y RStudio hasta un análisis sencillo de datos de salud con tablas, gráficos, inferencia básica y publicación de un ensayo corto en RPubs.

## Unidades

| Unidad | Tema | Producto |
| --- | --- | --- |
| 1 | Inicio: R para estudiantes de medicina | Mapa mental y reflexion breve |
| 2 | Instalacion y primeros comandos | Script `.R` comentado |
| 3 | Carga y exploracion de datos de salud | Reporte de exploracion inicial |
| 4 | Limpieza y preparacion de datos clinicos | Base limpia, script y bitacora |
| 5 | Estadistica descriptiva aplicada a salud | Tabla 1, graficos e interpretaciones |
| 6 | Inferencia basica con R | Informe con tres pruebas |
| 7 | Modelos sencillos en datos de salud | Reporte de regresion |
| 8 | Reporte reproducible y publicacion en RPubs | URL publica del informe final |

## Funcionalidades

- Login con validación Apps Script/Google Sheets y respaldo local de práctica.
- Ruta secuencial con unidades, subniveles, bloqueos pedagógicos y productos.
- Dashboard principal migrado desde la plantilla funcional del curso ejemplo, con sidebar, topbar, logros, calendario, comunidad, administración y tarjetas de seguimiento.
- Unidad activa tipo presentación interactiva: diapositivas con transición, concepto, caso clínico, código R ejecutable en WebR, evidencia y foro por subnivel.
- Prácticas guiadas con 8 laboratorios WebR y 24 subniveles paso a paso sobre datos de salud.
- Recursos NotebookLM integrados como fuente canonica: 9 Google Docs, indice JSON local y fichas resumidas para diapositivas.
- Flashcards y clasificadores interactivos para repaso activo antes de cuestionarios.
- Progreso local/offline con cola de sincronización hacia Google Sheets.
- Calendario de materiales, quizzes y entrega final.
- Foros por subnivel registrados en la hoja `FOROS`.
- Cuestionarios autocorregibles con registro en `CALIFICACIONES`.
- Carga de evidencias, imágenes y archivos hacia Google Drive.
- Laboratorio R ejecutable en línea con WebR, editor, botón Ejecutar, salida en pantalla y dataset ficticio de salud.
- Panel de administración para preparar el libro, revisar configuración y exportar progreso.
- Funcionamiento instalable tipo PWA con `manifest.json` y `sw.js`.

## Acceso inicial

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin` | `123456` |

Esta credencial reinicia el acceso del aula y no depende del correo. Es una clave de demostración para un sitio público estático; no debe usarse para controlar información sensible.

Si el navegador conserva una pantalla anterior que solo pide contraseña, abrir `entrar.html` para limpiar caché y volver al login actual.

## Estructura

```text
.
├── index.html
├── dashboard.html
├── documentos.html
├── config.js
├── js/
│   ├── api.js
│   └── app.js
├── apps-script/
│   ├── Code.js
│   └── appsscript.json
├── assets/
│   └── pedagogical/
├── manifest.json
├── sw.js
├── css/
│   ├── styles.css
│   ├── styles-template.css
│   └── documentos.css
├── data/
│   ├── usuarios.json
│   ├── datasets/
│   └── quizzes/
├── docs/
├── guia_didactica/
├── laboratorio/
├── practicas/
└── unidades/
```

## Backend configurado

- Google Sheet: <https://docs.google.com/spreadsheets/d/1mlgNE-pDQZuAuUNj524dHn-zF9cbYvv6a6shvTDDtTg/edit>
- Apps Script: <https://script.google.com/home/projects/12qxXJci0JxfJTPEdxPfMw_bTlUTHBUHK2rtcRenpF-RbODAg8FhCYWwC/edit>
- Web app actual en `config.js`: `https://script.google.com/macros/s/AKfycbxxKpSzXV1u5bhOTMd9Z716MtcGS7naJ2bLsdCx_F2ScDlIPDhdnaiCWvGLcaa7-jRu/exec`
- Drive evidencias: <https://drive.google.com/drive/folders/1g5rmr_z3wo2JbkPD4GGl3EhvC-Jq1E6v>

El libro ya tiene pestañas técnicas (`CONFIG`, `USUARIOS`, `PROGRESO`, `CALIFICACIONES`, `EVENTOS`, `FOROS`, `CALENDARIO`, `EVIDENCIAS`, `ERRORES`, `VERSIONES`). Si el endpoint Apps Script devuelve acceso denegado al abrir el Sheet, hay que conceder permiso de edición a la cuenta que ejecuta el deployment o desplegar el web app desde una cuenta con acceso al libro.

## Publicación

1. Confirmar que GitHub Pages esté activo desde la rama `main`.
2. Abrir `https://investigapyrm.github.io/curso_R_aplicado_salud/`.
3. Probar login, navegación, cuestionarios y carga del dataset.
4. Verificar que el sitio se pueda instalar como PWA cuando el navegador lo permita.

## Inspiración académica

El diseño curricular toma como punto de partida el enfoque de inferencia con R y reportes reproducibles usado en materiales previos publicados en RPubs por Diego Meza, adaptándolo a un curso breve, autogestionado y centrado en datos de salud.
