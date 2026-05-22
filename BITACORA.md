# Bitácora

## 2026-05-22

- Objetivo: duplicar la idea del aula web `analiticabigdata` y adaptarla a un curso autogestionado de R aplicado a salud.
- Carpeta destino: `G:\Mi unidad\UNICONCEP_cursos\curso_R_en_salud`.
- Repositorio destino: `https://github.com/investigapyrm/curso_R_aplicado_salud.git`.
- Estado inicial: carpeta vacía; se clonó el repositorio remoto, que estaba vacío.
- Decisión: crear una primera versión limpia y estática, con foco exclusivo en R, salud, inferencia básica y publicación en RPubs.
- Validación local: JSON de usuarios/cuestionarios parsea correctamente; `index.html`, `dashboard.html`, CSS, manifest y rutas de unidad responden 200 en servidor local `http://localhost:8765/`.
- Commit local creado: `803ee29 Crear aula R aplicado a salud`.
- Bloqueo de publicación: `git push -u origin main` falló con 403 porque GitHub denegó escritura a la cuenta local `diegomezapy` sobre `investigapyrm/curso_R_aplicado_salud.git`.
- Pendiente operativo: otorgar permiso de escritura a `diegomezapy` o ejecutar el push con una cuenta/token con permisos sobre `investigapyrm`.
