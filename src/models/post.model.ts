export const TipoPost = {
  CHAT_GENERAL: 'CHAT_GENERAL',
  NOTICIA: 'NOTICIA',
  BUSCO_EQUIPO: 'BUSCO_EQUIPO',
  EQUIPO_BUSCA_JUGADOR: 'EQUIPO_BUSCA_JUGADOR',
  PARTIDO_URGENTE: 'PARTIDO_URGENTE'
} as const;

export type TipoPost = typeof TipoPost[keyof typeof TipoPost];

export const EstadoPost = {
  ACTIVO: 'ACTIVO',
  CERRADO: 'CERRADO',
  ARCHIVADO: 'ARCHIVADO'
} as const;

export type EstadoPost = typeof EstadoPost[keyof typeof EstadoPost];

export interface Post {
  id: string;
  titulo: string;
  contenido: string;
  autorId: number;
  autorNombre?: string;
  autorProfileImageUrl?: string;
  tipoPost: TipoPost;
  estado: EstadoPost;
  deporte?: string;
  ubicacion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  cantidadComentarios?: number;
}

export interface CreatePostRequest {
  titulo: string;
  contenido: string;
  autorId: number;
  tipoPost: TipoPost;
  deporte?: string;
  ubicacion?: string;
}

export interface Comentario {
  id: string;
  postId: string;
  autorId: number;
  autorNombre?: string;
  autorProfileImageUrl?: string;
  contenido: string;
  comentarioPadreId?: string;
  fechaCreacion: string;
  respuestas?: Comentario[];
}

export interface CreateComentarioRequest {
  postId: string;
  autorId: number;
  contenido: string;
  comentarioPadreId?: string;
}

export interface ContactoAviso {
  id: string;
  postId: string;
  usuarioInteresadoId: number;
  autorPostId: number;
  telefonoRevelado: string;
  fechaContacto: string;
}
