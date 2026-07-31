# Documentación de TorneosUY

Esta carpeta centraliza la documentación técnica y de producto necesaria para
retomar el desarrollo del proyecto.

## Punto de partida

El análisis inicial se realizó el 30 de julio de 2026 sobre la rama `main`, en
el commit `1eb85ed`. La rama de trabajo `Miche` fue adelantada mediante
fast-forward hasta ese mismo commit.

## Documentos

- [Estado actual del frontend](frontend/ESTADO_ACTUAL.md): alcance existente,
  fortalezas, riesgos y deuda técnica detectada.
- [Plan de reactivación](frontend/PLAN_REACTIVACION.md): fases y prioridades
  recomendadas para volver a trabajar sobre el proyecto.
- [Matriz de validación funcional](frontend/MATRIZ_VALIDACION.md): checklist
  para comprobar los flujos críticos contra el backend.

## Documentación histórica

En la raíz del repositorio todavía existen documentos creados durante
implementaciones anteriores:

- `BLOG_FRONTEND_DOCS.md`
- `FINALIZE_TOURNAMENT_IMPLEMENTATION.md`
- `IMPLEMENTACION_UPDATE_TOURNAMENT.md`

Se consideran documentación histórica. Antes de usarlos como especificación
vigente, hay que contrastarlos con el comportamiento real del frontend y del
backend.

## Criterio de trabajo

Las mejoras nuevas se desarrollarán desde `Miche`. Antes de agregar alcance,
se recomienda completar la fase de reactivación técnica y registrar en la
matriz qué flujos funcionan realmente.
