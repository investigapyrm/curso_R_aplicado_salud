# R aplicado a la salud

Aula virtual autogestionada para estudiantes de medicina y ciencias de la salud que quieren aprender R desde cero y publicar un primer informe reproducible en RPubs.

Repositorio destino: <https://github.com/investigapyrm/curso_R_aplicado_salud>

GitHub Pages esperado: <https://investigapyrm.github.io/curso_R_aplicado_salud/>

## Objetivo

Guiar a una persona sin experiencia previa desde la instalación de R y RStudio hasta un análisis sencillo de datos de salud con tablas, gráficos, inferencia básica y publicación de un ensayo corto en RPubs.

## Unidades

| Unidad | Tema | Producto |
| --- | --- | --- |
| 1 | Instalación de R, RStudio y primeros pasos | Entorno configurado y script inicial |
| 2 | Datos de salud, ética y limpieza básica | Dataset importado, limpiado y documentado |
| 3 | Descripción y visualización de datos clínicos | Tabla descriptiva y gráficos en ggplot2 |
| 4 | Inferencia básica aplicada a salud | Intervalos, pruebas y lectura clínica |
| 5 | Modelos sencillos para preguntas de salud | Regresión lineal/logística interpretada |
| 6 | Reporte reproducible y publicación en RPubs | Ensayo HTML publicado |

## Funcionalidades

- Login local de práctica con roles `estudiante` y `docente`.
- Progreso guardado en el navegador con `localStorage`.
- Seis unidades con contenidos, actividades, tareas y proyecto integrador.
- Cuestionarios autocorregibles con retroalimentación inmediata.
- Laboratorio R con scripts copiable y dataset ficticio de salud.
- Funcionamiento instalable tipo PWA con `manifest.json` y `sw.js`.
- Diseño responsive para celular, tablet y escritorio.
- Documentación mínima en `docs/`.

## Acceso de prueba

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Estudiante | `estudiante` | `r-salud` |
| Docente | `docente` | `docente-r` |

Estas credenciales son de demostración para un sitio público estático. No deben usarse para controlar información sensible.

## Estructura

```text
.
├── index.html
├── dashboard.html
├── manifest.json
├── sw.js
├── css/
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

## Publicación

1. Confirmar que GitHub Pages esté activo desde la rama `main`.
2. Abrir `https://investigapyrm.github.io/curso_R_aplicado_salud/`.
3. Probar login, navegación, cuestionarios y carga del dataset.
4. Verificar que el sitio se pueda instalar como PWA cuando el navegador lo permita.

## Inspiración académica

El diseño curricular toma como punto de partida el enfoque de inferencia con R y reportes reproducibles usado en materiales previos publicados en RPubs por Diego Meza, adaptándolo a un curso breve, autogestionado y centrado en datos de salud.

