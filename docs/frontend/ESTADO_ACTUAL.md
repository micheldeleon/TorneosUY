# Estado actual del frontend

Fecha del análisis: 30 de julio de 2026.

Rama analizada: `main`, commit `1eb85ed`.

Rama elegida para continuar: `Miche`.

## Resumen ejecutivo

TorneosUY no es un prototipo vacío. Es una SPA de tamaño considerable, con
gran parte del dominio implementado, pero sin una línea base reproducible y
verificada.

El frontend contiene aproximadamente 20.800 líneas de TypeScript distribuidas
en 149 archivos. La última actividad registrada antes del análisis fue el 9 de
febrero de 2026.

Antes de agregar funcionalidades es necesario comprobar instalación, build,
lint e integración con el backend. Después conviene estabilizar el acceso a la
API, dividir los componentes más grandes y eliminar versiones duplicadas.

## Stack

- React 19.
- TypeScript 5.9.
- Vite 7.
- React Router 7.
- Tailwind CSS 4.
- Radix UI.
- Axios.
- React Hook Form y Zod.
- TipTap.
- Framer Motion.
- Sonner.
- Bun como gestor sugerido por `bun.lock`.

## Alcance implementado

### Acceso y usuarios

- Registro.
- Login tradicional.
- Login con Google.
- Persistencia de sesión.
- Verificación de expiración del JWT.
- Perfil y actualización de datos.
- Cambio de contraseña.
- Carga de imagen de perfil.
- Solicitud para convertirse en organizador.
- Rutas privadas y control de rol administrativo.

### Torneos

- Exploración y filtros.
- Vista de detalle.
- Creación y edición.
- Inscripción individual y por equipos.
- Retiro del torneo.
- Gestión de participantes.
- Inicio, cancelación y finalización.
- Generación de fixture.
- Registro de resultados.
- Liga, eliminación y carreras.
- Tabla de posiciones, bracket y ranking.
- Estados iniciado, cancelado y finalizado.
- Carga de imagen del torneo.

### Otras áreas

- Panel administrativo.
- Blog, publicaciones, comentarios y respuestas.
- Formulario de contacto.
- Notificaciones mediante SSE, polling, toast, sonido y API del navegador.
- Landing, precios, FAQ y sección institucional.
- Configuración de rutas para Vercel.

## Fortalezas

- El dominio principal tiene una cobertura funcional amplia.
- La estructura general por componentes, páginas, servicios, hooks y modelos
  es reconocible.
- Hay formularios con validación mediante Zod.
- Existen componentes visuales reutilizables.
- Se contemplan carga, error, cancelación de requests y expiración de sesión.
- Hay documentación histórica de algunas implementaciones.
- La interfaz muestra intención responsive y una identidad visual definida.

## Estado de verificación

Durante el análisis no se pudo ejecutar el build ni el lint:

- `node_modules` no estaba presente.
- Bun no estaba instalado en el entorno.
- No se instalaron dependencias para evitar alterar el repositorio durante una
  revisión de solo diagnóstico.

Por lo tanto, el commit actual no debe considerarse compilado o validado hasta
completar la primera fase del plan de reactivación.

Tampoco se encontró una suite de tests unitarios, de componentes o end-to-end.

## Hallazgos y oportunidades de mejora

### Prioridad crítica: contrato de `useApi`

`src/hooks/useApi.ts` expone una función `fetch` que inicia una petición, pero
devuelve inmediatamente una función de cancelación. No devuelve una promesa
con el resultado.

Como consecuencia, expresiones como `await markAsRead(id)` no esperan la
respuesta HTTP, aunque visualmente parezcan hacerlo.

Acción recomendada:

- Renombrar la operación a `execute`.
- Hacer que retorne `Promise<T>`.
- Mantener la cancelación como responsabilidad interna o como una operación
  independiente.
- Estandarizar el tratamiento de errores Axios.

### Prioridad crítica: cliente HTTP inconsistente

`src/services/api.service.ts` mezcla:

- La instancia global de Axios.
- Una instancia configurada con interceptores.
- URLs absolutas con `BASE_URL`.
- Rutas relativas `/api/...`.

Esto puede provocar que algunas llamadas autenticadas no incluyan el token o
no pasen por el tratamiento común de respuestas `401`.

Acción recomendada:

- Crear un cliente público para login y registro.
- Crear un cliente autenticado para el resto.
- Centralizar base URL, autorización, errores y expiración.
- Documentar `VITE_API_BASE_URL` en `.env.example`.

### Prioridad alta: componentes monolíticos

Los archivos de mayor tamaño incluyen:

| Archivo | Tamaño aproximado |
| --- | ---: |
| `DashboardAlt.tsx` | 116 KB |
| `ManageTournament.tsx` | 66 KB |
| `AdminDashboard.tsx` | 45 KB |
| `TournamentLive.tsx` | 42 KB |
| `TournamentRegistration.tsx` | 40 KB |

Estos componentes mezclan renderizado, requests, reglas de negocio,
transformación de datos y modales.

Acción recomendada:

- Extraer hooks de casos de uso.
- Separar secciones visuales.
- Extraer transformaciones puras de fixture, tabla, bracket y carreras.
- Probar las funciones puras antes de reorganizar el renderizado.

### Prioridad alta: versiones duplicadas

Conviven versiones antiguas y nuevas:

- `Dashboard` y `DashboardAlt`.
- `TournamentDetails` y `TournamentDetailsAlt`.
- `Navbar` y `NavbarModern`.
- Variantes de tarjetas.
- La ruta `/perfil2` todavía expone el dashboard anterior.

Acción recomendada:

- Elegir una versión canónica.
- Comparar funciones faltantes.
- Migrar únicamente lo necesario.
- Eliminar rutas y componentes obsoletos.

### Prioridad alta: tipado del dominio

Se detectaron aproximadamente 123 usos de `any`, especialmente alrededor de:

- Fixtures.
- Partidos.
- Equipos.
- Participantes.
- Standings.
- Carreras.
- Errores y respuestas HTTP.

Acción recomendada:

- Definir `Fixture`, `Match`, `Standing`, `TournamentTeam`, `Participant`,
  `RaceResult` y `ApiError`.
- Compartir o generar los contratos a partir del backend si es posible.
- Evitar casts en las transformaciones del dominio.

### Prioridad media: notificaciones y contexto global

El contexto global concentra:

- Usuario y token.
- Persistencia.
- Expiración del JWT.
- Notificaciones.
- SSE.
- Polling.
- Audio.
- Notificaciones del navegador.

También hay SSE y polling cada 30 segundos, lo que puede duplicar eventos.

Acción recomendada:

- Separar `AuthProvider` y `NotificationsProvider`.
- Deduplicar notificaciones por identificador.
- Usar polling solamente como fallback del SSE.
- Solicitar permisos del navegador después de una acción explícita.
- Corregir las dependencias de callbacks relacionadas con `audioContext`.
- Verificar la ruta del icono de notificación.

### Prioridad media: rutas y layouts

`src/App.tsx` mantiene una lista manual de rutas válidas aparte de la
declaración de `<Routes>`. Agregar una ruta sin actualizar ambas listas puede
ocultar navbar y footer accidentalmente.

Acción recomendada:

- Usar layouts de React Router.
- Crear un layout público, uno autenticado y uno sin chrome.
- Eliminar la lista duplicada de rutas válidas.

### Prioridad media: carga inicial

Las páginas se importan estáticamente y existe un splash obligatorio de 1,2
segundos.

Acción recomendada:

- Aplicar `React.lazy` por ruta.
- Usar `Suspense` con un loader real.
- Eliminar el retraso artificial.
- Revisar el tamaño del bundle después del primer build válido.

### Prioridad media: calidad

- No hay tests automáticos.
- Hay aproximadamente 96 usos de `console`.
- Existe lógica pendiente marcada con `TODO` en la gestión de torneos.
- Permanecen assets de la plantilla Vite.
- El README de raíz sigue siendo el genérico de Vite.
- ESLint no usa todavía reglas TypeScript con información de tipos.
- Vite oculta el overlay y reduce el logging de errores.

### Prioridad media: accesibilidad

La complejidad de formularios, diálogos, menús y notificaciones amerita una
auditoría específica.

Acción recomendada:

- Verificar textos alternativos.
- Comprobar labels y mensajes de error.
- Probar navegación completa por teclado.
- Revisar foco al abrir y cerrar modales.
- Validar contraste.
- Añadir estados `aria-live` en feedback asíncrono.

## Conclusión

El proyecto tiene suficiente producto construido para justificar su
continuación. El mayor riesgo no es la falta de funcionalidades, sino no saber
cuáles siguen funcionando juntas. La prioridad inmediata es obtener una línea
base ejecutable y una matriz funcional antes de refactorizar o ampliar alcance.
