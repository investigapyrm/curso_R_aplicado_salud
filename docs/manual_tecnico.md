# Manual técnico

## Tipo de aplicación

Sitio estático publicable en GitHub Pages. No requiere backend para la primera versión.

## Archivos principales

- `index.html`: login local de práctica.
- `dashboard.html`: aula virtual, progreso, quizzes y proyecto RPubs.
- `data/usuarios.json`: usuarios demo.
- `data/quizzes/`: cuestionarios autocorregibles.
- `data/datasets/salud_muestra.csv`: dataset ficticio.
- `manifest.json` y `sw.js`: instalación PWA y cache básico.

## Publicación

1. Subir cambios a la rama `main`.
2. Activar GitHub Pages desde `main` y carpeta raíz.
3. Probar `index.html`, `dashboard.html`, quizzes y enlaces de unidad.

## Seguridad

El login es solo una barrera pedagógica local en una app estática. No debe usarse para datos sensibles ni información real de pacientes.

## Actualización de contenidos

Editar las unidades en `dashboard.html` y las páginas HTML dentro de `unidades/unidadN/`. Los cuestionarios se editan en JSON.

