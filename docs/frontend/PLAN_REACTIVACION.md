# Plan de reactivación del frontend

Este plan ordena el trabajo necesario para continuar desde la rama `Miche`.

## Objetivo

Pasar de un frontend con alcance amplio pero estado incierto a una base:

- Reproducible.
- Compilable.
- Verificada contra el backend.
- Con flujos críticos cubiertos por tests.
- Preparada para mejoras funcionales y visuales.

## Fase 0: línea base de Git

Estado inicial completado:

- [x] Confirmar que el código analizado estaba en `main`.
- [x] Crear la rama local `Miche` siguiendo `origin/Miche`.
- [x] Adelantar `Miche` mediante fast-forward hasta `main`.
- [x] Crear documentación inicial.
- [ ] Confirmar y publicar los cambios documentales en `origin/Miche`.

No se debe desarrollar directamente sobre `main`.

## Fase 1: entorno reproducible

### Tareas

- [ ] Elegir oficialmente Bun o npm.
- [ ] Documentar la versión requerida de Node y del gestor.
- [ ] Instalar dependencias desde el lockfile.
- [ ] Ejecutar `build`.
- [ ] Ejecutar `lint`.
- [ ] Registrar y corregir todos los errores iniciales.
- [ ] Documentar `VITE_API_BASE_URL`.
- [ ] Configurar Google OAuth para desarrollo o documentar cómo desactivarlo.
- [ ] Confirmar URL y versión del backend compatible.
- [ ] Reemplazar el README genérico de Vite.

### Criterio de salida

Una persona nueva puede clonar el repositorio, configurar variables y levantar
el frontend en menos de 15 minutos.

## Fase 2: validación funcional

Ejecutar la matriz de `MATRIZ_VALIDACION.md` contra un backend conocido.

### Tareas

- [ ] Preparar usuarios de prueba para participante, organizador y admin.
- [ ] Registrar endpoints y respuestas reales.
- [ ] Clasificar cada flujo como operativo, parcial, bloqueado o roto.
- [ ] Guardar errores reproducibles con pasos claros.
- [ ] Separar fallos de frontend, backend, datos y configuración.

### Criterio de salida

Todos los flujos críticos tienen estado conocido y los bloqueos están
priorizados.

## Fase 3: estabilización técnica

Orden recomendado:

1. Rediseñar `useApi` para retornar promesas reales.
2. Unificar los clientes Axios.
3. Estandarizar errores y mensajes.
4. Crear los tipos faltantes del dominio.
5. Separar autenticación y notificaciones.
6. Corregir deduplicación entre SSE y polling.
7. Consolidar componentes y rutas duplicadas.
8. Extraer transformaciones puras de torneos.
9. Dividir los componentes monolíticos.
10. Incorporar lazy loading por ruta.
11. Limpiar logs, assets y código obsoleto.

### Criterio de salida

- Build y lint limpios.
- Sin variantes antiguas accesibles por rutas.
- Requests autenticados pasan por un único cliente.
- Los casos de uso críticos no dependen de observar efectos indirectos.

## Fase 4: red de seguridad

Herramientas sugeridas:

- Vitest.
- React Testing Library.
- Mock Service Worker si se necesitan mocks HTTP.
- Playwright para E2E.

### Primera cobertura

- [ ] Transformación de fixture de liga.
- [ ] Transformación de bracket eliminatorio.
- [ ] Cálculo de standings.
- [ ] Expiración de JWT.
- [ ] Respuesta `401` del cliente HTTP.
- [ ] Login exitoso y fallido.
- [ ] Creación e inscripción.
- [ ] Ciclo básico de torneo.
- [ ] Restricción de rutas por rol.

### Criterio de salida

Los flujos de login y ciclo básico de torneo se validan automáticamente en un
entorno repetible.

## Fase 5: UX, accesibilidad y rendimiento

- [ ] Sustituir el splash con demora fija.
- [ ] Agregar estados vacíos coherentes.
- [ ] Unificar loaders, errores y confirmaciones.
- [ ] Auditar navegación por teclado.
- [ ] Revisar foco en modales.
- [ ] Revisar contraste y textos alternativos.
- [ ] Solicitar notificaciones mediante opt-in.
- [ ] Medir bundle y aplicar carga diferida.
- [ ] Probar las pantallas prioritarias en dispositivos móviles reales.

## Fase 6: nuevas mejoras

Las funcionalidades nuevas se priorizarán solamente después de completar la
línea base funcional.

Cada mejora deberá incluir:

- Problema de usuario.
- Alcance y fuera de alcance.
- Contrato backend afectado.
- Criterios de aceptación.
- Estados de carga, vacío y error.
- Prueba mínima requerida.

## Primer sprint sugerido

Un primer sprint razonable debería entregar:

1. Instalación documentada.
2. Build y lint limpios.
3. Matriz de flujos principales completada.
4. Nuevo contrato de `useApi`.
5. Cliente HTTP unificado.
6. Dos tests E2E: login y ciclo básico de torneo.

No se recomienda combinar ese sprint con un rediseño visual general.
