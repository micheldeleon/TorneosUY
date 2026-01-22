import { loadAbort } from "./utilities/loadAbort.utility";
import { getAxiosInstance } from "./axios.service";
import type { 
  Post, 
  CreatePostRequest, 
  Comentario, 
  CreateComentarioRequest, 
  ContactoAviso,
  UseApiCall 
} from "../models";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:8080");
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");
const axiosInstance = getAxiosInstance();

// ============ POSTS ============

export const getPosts = (): UseApiCall<Post[]> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<Post[]>(`${BASE_URL}/api/posts`, { signal: controller.signal }),
    controller,
  };
};

export const getPostById = (id: string): UseApiCall<Post> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<Post>(`${BASE_URL}/api/posts/${id}`, { signal: controller.signal }),
    controller,
  };
};

export const getPostsByTipo = (tipo: string): UseApiCall<Post[]> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<Post[]>(`${BASE_URL}/api/posts/tipo/${tipo}`, { signal: controller.signal }),
    controller,
  };
};

export const getPostsByAutor = (autorId: number): UseApiCall<Post[]> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<Post[]>(`${BASE_URL}/api/posts/autor/${autorId}`, { signal: controller.signal }),
    controller,
  };
};

export const createPost = (postData: CreatePostRequest): UseApiCall<Post> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.post<Post>(`${BASE_URL}/api/posts`, postData, { signal: controller.signal }),
    controller,
  };
};

export const cerrarPost = (postId: string, userId: number): UseApiCall<Post> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.put<Post>(
      `${BASE_URL}/api/posts/${postId}/cerrar?userId=${userId}`, 
      {}, 
      { signal: controller.signal }
    ),
    controller,
  };
};

// ============ COMENTARIOS ============

export const getComentariosByPost = (postId: string): UseApiCall<Comentario[]> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<Comentario[]>(`${BASE_URL}/api/comentarios/post/${postId}`, { signal: controller.signal }),
    controller,
  };
};

export const createComentario = (comentarioData: CreateComentarioRequest): UseApiCall<Comentario> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.post<Comentario>(`${BASE_URL}/api/comentarios`, comentarioData, { signal: controller.signal }),
    controller,
  };
};

// ============ CONTACTOS ============

export const contactarAviso = (postId: string, usuarioId: number): UseApiCall<ContactoAviso> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.post<ContactoAviso>(
      `${BASE_URL}/api/contactos/aviso/${postId}?usuarioId=${usuarioId}`, 
      {}, 
      { signal: controller.signal }
    ),
    controller,
  };
};

export const getContactosRecibidos = (autorId: number): UseApiCall<ContactoAviso[]> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<ContactoAviso[]>(`${BASE_URL}/api/contactos/recibidos/${autorId}`, { signal: controller.signal }),
    controller,
  };
};

export const getContactosRealizados = (usuarioId: number): UseApiCall<ContactoAviso[]> => {
  const controller = loadAbort();
  return {
    call: axiosInstance.get<ContactoAviso[]>(`${BASE_URL}/api/contactos/realizados/${usuarioId}`, { signal: controller.signal }),
    controller,
  };
};
