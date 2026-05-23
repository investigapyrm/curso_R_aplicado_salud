# Plan de integracion de recursos NotebookLM

## Diagnostico

Los recursos creados con NotebookLM no deben quedar como anexos o lecturas sueltas. Son, en la practica, el diseno curricular completo del curso: 8 unidades, evaluaciones, foros, rubricas, checklists, glosarios, codigo R comentado y un proyecto final en RPubs.

La version publicada del aula conserva una estructura visual potente heredada del curso ejemplo, pero todavia esta organizada como 4 unidades maestras. Los documentos de NotebookLM justifican migrar el curso a una ruta secuencial de 8 semanas, con una experiencia tipo diapositivas y laboratorio WebR en cada unidad.

## Principio rector

Usar Google Docs como fuente canonica y generar copias locales ligeras para GitHub Pages:

- Google Docs: version editable, revisable y compartible del contenido maestro.
- Archivos locales HTML/JSON: version rapida, navegable, cacheable y apta para el aula web.
- WebR: ejecucion practica de los bloques de codigo R dentro del curso.
- Google Sheets/AppScript: progreso, login, foros, evidencias, tareas y cuestionarios.

El limite de 200 notebooks en NotebookLM no bloquea el aula. NotebookLM puede quedar como capa de apoyo posterior; los documentos de Drive ya contienen lo necesario para construir el curso.

## Inventario de documentos

| Doc | Recurso | Uso principal en el aula |
| --- | --- | --- |
| 00 | Presentacion maestra del curso | Configuracion general, duracion, perfil de egreso, evaluacion, calendario y reglas de aprobacion. |
| 01 | Inicio: R para estudiantes de medicina | Motivacion, alfabetizacion en datos, forum inicial y mapa mental. |
| 02 | Instalacion y primeros comandos | Onboarding tecnico, script inicial, soporte de abandono temprano y laboratorio base. |
| 03 | Carga y exploracion de datos | Importacion, exploracion inicial, datos faltantes, outliers y reporte de exploracion. |
| 04 | Limpieza y preparacion de datos | Pipeline de limpieza, variables derivadas, bitacora de cambios y base limpia. |
| 05 | Estadistica descriptiva aplicada | Tabla 1, medidas descriptivas, graficos e interpretacion clinica. |
| 06 | Inferencia basica con R | Hipotesis, pruebas t, Wilcoxon, chi-cuadrado, correlacion, IC95% y relevancia clinica. |
| 07 | Modelos de regresion | Modelos lineales y logisticos, OR, R2, limitaciones e interpretacion prudente. |
| 08 | Reporte reproducible y RPubs | R Markdown, informe cientifico breve, publicacion en RPubs y cierre del curso. |

## Conversion pedagogica por unidad

Cada documento de unidad debe transformarse en el mismo conjunto de componentes del aula:

1. Portada de unidad: promesa concreta y producto esperado.
2. Resultados medibles: 4 a 7 metas visibles como checklist.
3. Microclase en diapositivas: conceptos clave, errores frecuentes y ejemplo clinico.
4. Codigo ejecutable: bloque R cargable en WebR.
5. Practica guiada: pasos cortos con avance secuencial.
6. Actividad autonoma: evidencia entregable, criterios y tiempo sugerido.
7. Foro: pregunta obligatoria y pregunta optativa.
8. Cuestionario: 10 preguntas con retroalimentacion.
9. Rubrica: criterio, niveles y puntaje.
10. Glosario: terminos clave como flashcards.
11. Checklist de cierre: condiciones para desbloquear la siguiente unidad.
12. Recursos complementarios: enlaces curados.

## Mapa recomendado de unidades

### Unidad 1: Inicio en R para medicina

Objetivo en aula: que el estudiante entienda por que R le sirve a una pregunta clinica real.

Entregable: mapa mental y reflexion breve sobre el uso de R en su futura practica medica.

Uso en interfaz: slides motivacionales, foro de expectativas, quiz diagnostico conceptual.

### Unidad 2: Instalacion y primeros comandos

Objetivo en aula: reducir la barrera tecnica inicial.

Entregable: script `.R` con operaciones basicas, vectores, data frame, paquetes y capturas si aplica.

Uso en interfaz: guia paso a paso, laboratorio WebR para quien aun no tenga RStudio y foro de soporte.

### Unidad 3: Carga y exploracion

Objetivo en aula: formar el habito de explorar antes de analizar.

Entregable: reporte de exploracion con estructura, tipos de variables, NA, outliers e inconsistencias.

Uso en interfaz: dataset ficticio descargable, practica de `read_csv`, `glimpse`, `summary`, `is.na` y `clean_names`.

### Unidad 4: Limpieza y preparacion

Objetivo en aula: pasar de dato bruto a dato analizable con criterio clinico.

Entregable: base limpia, script de limpieza y bitacora de cambios.

Uso en interfaz: pipeline visual de limpieza, slides con decisiones eticas y WebR con `mutate`, `case_when`, `na_if`, `filter` y `select`.

### Unidad 5: Estadistica descriptiva

Objetivo en aula: construir la Tabla 1 de un estudio medico.

Entregable: Tabla 1, tres graficos y comentarios clinicos.

Uso en interfaz: galeria de graficos, practica con `gtsummary`, decision media vs mediana y foro sobre distribuciones asimetricas.

### Unidad 6: Inferencia basica

Objetivo en aula: elegir pruebas y leer resultados sin caer en interpretaciones mecanicas.

Entregable: informe con tres pruebas, hipotesis, p-valor, IC95%, efecto e interpretacion clinica.

Uso en interfaz: selector de prueba estadistica, laboratorio con `t.test`, `wilcox.test`, `chisq.test`, `cor.test` y debate sobre significancia vs relevancia.

### Unidad 7: Modelos sencillos

Objetivo en aula: ajustar e interpretar modelos basicos sin prometer causalidad.

Entregable: reporte de regresion lineal y logistica con tabla, graficos y limitaciones.

Uso en interfaz: simulador conceptual de OR/R2, WebR con `lm`, `glm`, `broom` y `gtsummary`.

### Unidad 8: R Markdown y RPubs

Objetivo en aula: convertir todo el recorrido en un informe cientifico reproducible.

Entregable: URL publica de RPubs con el informe final.

Uso en interfaz: plantilla `.Rmd`, checklist de publicacion, foro de proyectos y rubrica final.

## Cambios tecnicos sugeridos

1. Migrar `TOTAL_UNITS` de 4 a 8 en `dashboard.html`.
2. Reemplazar `UNIT_SUBLEVELS` por 8 unidades alineadas con los documentos NotebookLM.
3. Activar `NOTEBOOKLM_INDEX_URL` apuntando a `recursos/notebooklm/indice.json`.
4. Crear `recursos/notebooklm/contenido_fichas.json` con fichas ya resumidas para las diapositivas.
5. Generar `data/quizzes/quiz_u1.json` a `quiz_u8.json` a partir de las 80 preguntas.
6. Actualizar `data/course.json` para eliminar el desajuste actual entre 4 unidades visuales y 6 unidades heredadas.
7. Crear 8 practicas WebR, una por unidad, usando los scripts de cada documento.
8. Actualizar `documentos.html` para mostrar los 9 Docs como biblioteca oficial del curso.
9. Registrar foros, tareas y rubricas por unidad en la estructura del aula y en Google Sheets.
10. Mantener los Google Docs enlazados como "material completo", pero no depender de que sean publicos para que el aula funcione.

## Estructura local propuesta

```text
recursos/notebooklm/
  indice.json
  contenido_fichas.json
  unidad01/
    lectura.html
    slides.json
    codigo.R
    actividad.json
    foro.json
    rubrica.json
    glosario.json
  unidad02/
  ...
  unidad08/
```

## Regla para las diapositivas

Cada unidad debe renderizarse como una secuencia de 12 a 18 diapositivas con transicion, no como una pagina larga. La estructura ideal:

1. Que vas a poder hacer al final.
2. Caso clinico inicial.
3. Concepto esencial.
4. Error frecuente.
5. Codigo minimo.
6. Ejecucion WebR.
7. Interpretacion del resultado.
8. Practica guiada.
9. Mini reto.
10. Foro.
11. Cuestionario.
12. Actividad autonoma.
13. Rubrica.
14. Checklist de desbloqueo.

## Prioridad de implementacion

Primera prioridad: reconstruir la navegacion a 8 unidades y poblar la Unidad 1 y 2 con contenido real de NotebookLM.

Segunda prioridad: generar cuestionarios y rubricas de las 8 unidades.

Tercera prioridad: extraer todos los bloques de codigo a practicas WebR ejecutables.

Cuarta prioridad: conectar tareas, foros y progreso con la planilla/AppScript.

Quinta prioridad: cuando se libere espacio en NotebookLM, crear el notebook y agregar las 9 fuentes como apoyo conversacional, no como dependencia tecnica del aula.
