# Sistema de Blog y Avisos - Frontend

## 📋 Descripción

Sistema completo de blog integrado en TorneosUY con las siguientes características:

- **Noticias deportivas**: Compartir novedades sobre torneos y eventos
- **Chat general**: Discusiones de la comunidad
- **Avisos clasificados**:
  - 🔍 Busco equipo
  - 👥 Equipo busca jugador
  - ⚡ Falta jugador para partido urgente

## 🚀 Características Implementadas

### Páginas

1. **BlogPage** (`/blog`)
   - Vista principal con todos los posts
   - Filtros por tipo (Todos, Noticias, Chat, Avisos)
   - Formulario de creación de posts
   - Funcionalidad de contactar avisos

2. **PostDetailPage** (`/posts/:postId`)
   - Vista detallada de un post
   - Sistema de comentarios anidados
   - Respuestas a comentarios
   - Acciones (cerrar post, contactar)

### Componentes

1. **PostCard**
   - Tarjeta visual para cada post
   - Badges de tipo y estado
   - Botón de contactar (solo en avisos)
   - Información de deporte y ubicación

2. **ComentarioItem**
   - Comentario con respuestas anidadas (hasta 3 niveles)
   - Botón de responder
   - Timestamps relativos
   - Avatar de usuario

3. **CreatePostForm**
   - Formulario completo de creación
   - Selección visual de tipo
   - Validaciones
   - Campos dinámicos según tipo

### Servicios

**post.service.ts** - Integración completa con la API:
- `getPosts()`: Obtener todos los posts
- `getPostById(id)`: Obtener post específico
- `getPostsByTipo(tipo)`: Filtrar por tipo
- `createPost(data)`: Crear nuevo post
- `cerrarPost(id, userId)`: Cerrar publicación
- `getComentariosByPost(postId)`: Obtener comentarios
- `createComentario(data)`: Crear comentario
- `contactarAviso(postId, userId)`: Contactar aviso
- `getContactosRecibidos(autorId)`: Ver contactos recibidos
- `getContactosRealizados(userId)`: Ver contactos realizados

### Modelos

**post.model.ts**:
```typescript
- TipoPost: CHAT_GENERAL | NOTICIA | BUSCO_EQUIPO | EQUIPO_BUSCA_JUGADOR | PARTIDO_URGENTE
- EstadoPost: ACTIVO | CERRADO | ARCHIVADO
- Post: Interfaz principal
- CreatePostRequest: DTO para crear posts
- Comentario: Interfaz de comentarios con respuestas anidadas
- CreateComentarioRequest: DTO para crear comentarios
- ContactoAviso: Interfaz de contactos revelados
```

## 🎨 Flujos de Usuario

### Crear Post
1. Usuario hace clic en "Nueva Publicación"
2. Selecciona tipo de post (iconos visuales)
3. Completa formulario (campos dinámicos según tipo)
4. Publica (se muestra inmediatamente en el feed)

### Contactar Aviso
1. Usuario ve un aviso que le interesa
2. Hace clic en "Contactar"
3. Confirmación (se revela su teléfono)
4. Recibe el teléfono del autor en un modal
5. Puede copiar y contactar directamente

### Comentar y Responder
1. Usuario lee un post
2. Escribe comentario o responde uno existente
3. Se crean hilos de conversación (hasta 3 niveles)
4. El autor recibe notificación automática

## 🔔 Notificaciones

El sistema genera notificaciones automáticas (via SSE):
- **Nuevo comentario**: Cuando alguien comenta tu post
- **Respuesta**: Cuando responden tu comentario
- **Contacto**: Cuando alguien contacta tu aviso

## 🛣️ Rutas Agregadas

```typescript
// App.tsx
<Route path="/blog" element={<BlogPage />} />
<Route path="/posts/:postId" element={<PostDetailPage />} />
```

## 🧭 Navegación

Se agregó el link "Blog" en el navbar principal entre "Torneos" y "¿Quiénes somos?".

## 🔐 Autenticación

- **Página de blog**: Accesible solo con login
- **Ver detalles**: Accesible para todos
- **Comentar**: Solo usuarios logueados
- **Crear post**: Solo usuarios logueados
- **Contactar aviso**: Solo usuarios logueados (excepto el autor)

## 📱 Diseño Responsive

Todos los componentes están diseñados con Tailwind CSS y son completamente responsive:
- Grid adaptativo de posts
- Formularios mobile-friendly
- Comentarios con scroll horizontal en móviles
- Filtros que se ajustan al ancho

## 🎯 Próximas Mejoras

- [ ] Agregar página "Mis Contactos" para ver avisos contactados
- [ ] Sistema de likes/reacciones
- [ ] Imágenes en posts
- [ ] Búsqueda por texto completo
- [ ] Moderación de contenido
- [ ] Reportar posts
- [ ] Estadísticas de vistas

## 🧪 Testing

Para probar el sistema:

1. Inicia sesión en la aplicación
2. Ve a `/blog` en el navbar
3. Crea un post de prueba
4. Prueba cada tipo (Noticia, Chat, Avisos)
5. Comenta y responde comentarios
6. Contacta un aviso (verás el teléfono revelado)

## 🔧 Configuración

Asegúrate de que las variables de entorno estén configuradas:

```env
VITE_API_BASE_URL=http://localhost:8080
```

El backend debe estar corriendo con los endpoints documentados.

## 📦 Archivos Nuevos

```
src/
├── models/
│   └── post.model.ts               # Modelos de datos
├── services/
│   └── post.service.ts             # Servicios API
├── components/
│   ├── PostCard/
│   │   ├── PostCard.tsx           # Tarjeta de post
│   │   └── index.ts
│   ├── ComentarioItem/
│   │   ├── ComentarioItem.tsx     # Comentario anidado
│   │   └── index.ts
│   └── CreatePostForm/
│       ├── CreatePostForm.tsx     # Formulario de creación
│       └── index.ts
└── public/
    ├── BlogPage.tsx               # Página principal del blog
    └── PostDetailPage.tsx         # Página de detalle de post
```

## 📞 Soporte

Para cualquier duda o problema con la integración del blog, revisa:
1. Los logs del navegador (F12 > Console)
2. Las respuestas de la API en Network
3. El estado de autenticación del usuario
4. Los permisos de notificaciones del navegador

---

✅ **Sistema completamente integrado y listo para usar**
