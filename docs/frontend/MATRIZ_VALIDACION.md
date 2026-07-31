# Matriz de validación funcional

Completar esta matriz contra un backend identificado y estable.

## Datos de la ejecución

| Campo | Valor |
| --- | --- |
| Fecha | Pendiente |
| Rama y commit frontend | `Miche` / pendiente |
| Backend y versión | Pendiente |
| URL frontend | Pendiente |
| Navegador | Pendiente |
| Responsable | Pendiente |

## Estados

- `NO PROBADO`: todavía no se ejecutó.
- `OPERATIVO`: cumple el resultado esperado.
- `PARCIAL`: funciona con limitaciones.
- `ROTO`: falla por un defecto reproducible.
- `BLOQUEADO`: depende de configuración, datos o backend.

## Acceso y sesión

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Registro tradicional | Visitante | Crea usuario y permite continuar | NO PROBADO | |
| Login válido | Usuario | Inicia sesión y redirige al perfil | NO PROBADO | |
| Login inválido | Visitante | Muestra un error comprensible | NO PROBADO | |
| Login con Google | Visitante | Autentica o registra al usuario | NO PROBADO | |
| Token expirado | Usuario | Limpia la sesión y solicita login | NO PROBADO | |
| Cerrar sesión | Usuario | Limpia datos locales y vuelve al inicio | NO PROBADO | |
| Ruta administrativa sin rol | Usuario | Impide el acceso | NO PROBADO | |

## Perfil y organizadores

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Consultar perfil | Usuario | Muestra datos actuales | NO PROBADO | |
| Editar perfil | Usuario | Persiste y refleja cambios | NO PROBADO | |
| Cambiar contraseña | Usuario | Valida y actualiza contraseña | NO PROBADO | |
| Subir imagen de perfil | Usuario | Persiste y muestra la imagen | NO PROBADO | |
| Solicitar rol organizador | Usuario | Registra la solicitud | NO PROBADO | |
| Aprobar solicitud | Admin | Otorga el rol correspondiente | NO PROBADO | |
| Rechazar solicitud | Admin | Registra el rechazo | NO PROBADO | |

## Descubrimiento de torneos

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Ver últimos torneos | Cualquiera | Carga tarjetas válidas | NO PROBADO | |
| Explorar todos | Cualquiera | Lista torneos disponibles | NO PROBADO | |
| Filtrar torneos | Cualquiera | Actualiza resultados correctamente | NO PROBADO | |
| Abrir detalle | Cualquiera | Muestra torneo y estado correcto | NO PROBADO | |
| Ver cancelado | Cualquiera | Muestra información de cancelación | NO PROBADO | |
| Ver finalizado | Cualquiera | Muestra resultados definitivos | NO PROBADO | |

## Creación e inscripción

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Crear torneo individual | Organizador | Crea un torneo válido | NO PROBADO | |
| Crear torneo por equipos | Organizador | Crea torneo con configuración de equipos | NO PROBADO | |
| Editar torneo | Organizador | Persiste campos permitidos | NO PROBADO | |
| Subir imagen de torneo | Organizador | Persiste y muestra la imagen | NO PROBADO | |
| Inscripción individual | Usuario | Agrega al participante | NO PROBADO | |
| Inscripción por equipos | Usuario | Crea o incorpora el equipo | NO PROBADO | |
| Retirarse del torneo | Participante | Elimina la inscripción permitida | NO PROBADO | |
| Eliminar participante | Organizador | Actualiza la lista | NO PROBADO | |

## Gestión y resultados

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Iniciar torneo | Organizador | Cambia estado y genera flujo activo | NO PROBADO | |
| Generar fixture liga | Organizador | Crea fechas y partidos válidos | NO PROBADO | |
| Generar eliminación | Organizador | Crea bracket válido | NO PROBADO | |
| Registrar resultado liga | Organizador | Actualiza partido y tabla | NO PROBADO | |
| Registrar resultado eliminatoria | Organizador | Actualiza bracket y avances | NO PROBADO | |
| Registrar carrera | Organizador | Guarda tiempos o posiciones | NO PROBADO | |
| Finalizar torneo completo | Organizador | Cambia a finalizado | NO PROBADO | |
| Finalizar con datos pendientes | Organizador | Impide finalizar y explica el motivo | NO PROBADO | |
| Cancelar torneo | Organizador | Cambia a cancelado | NO PROBADO | |

## Administración

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Listar usuarios | Admin | Muestra datos administrativos | NO PROBADO | |
| Desactivar usuario | Admin | Impide su uso según contrato | NO PROBADO | |
| Restaurar usuario | Admin | Recupera el acceso | NO PROBADO | |
| Desactivar torneo | Admin | Oculta o bloquea el torneo | NO PROBADO | |
| Reactivar torneo | Admin | Recupera el torneo | NO PROBADO | |

## Blog, contacto y notificaciones

| Flujo | Rol | Resultado esperado | Estado | Evidencia o incidencia |
| --- | --- | --- | --- | --- |
| Listar posts | Cualquiera | Carga y filtra publicaciones | NO PROBADO | |
| Abrir post | Cualquiera | Muestra contenido completo | NO PROBADO | |
| Crear post | Usuario autorizado | Publica contenido válido | NO PROBADO | |
| Comentar | Usuario | Agrega comentario | NO PROBADO | |
| Responder comentario | Usuario | Agrega respuesta | NO PROBADO | |
| Enviar contacto | Cualquiera | Envía y confirma el mensaje | NO PROBADO | |
| Cargar notificaciones | Usuario | Muestra lista y contador | NO PROBADO | |
| Recibir notificación SSE | Usuario | Agrega una única notificación | NO PROBADO | |
| Marcar una como leída | Usuario | Actualiza servidor y contador | NO PROBADO | |
| Marcar todas como leídas | Usuario | Actualiza servidor y contador | NO PROBADO | |

## Revisión transversal

Para cada flujo operativo, comprobar además:

- [ ] Estado de carga visible.
- [ ] Estado vacío comprensible.
- [ ] Error de red comprensible.
- [ ] Doble clic no duplica operaciones.
- [ ] Navegación por teclado.
- [ ] Comportamiento móvil.
- [ ] Actualización tras recargar la página.
- [ ] Ausencia de errores inesperados en consola.
