import { getAxiosInstance } from "./axios.service";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:8080");
const axiosInstance = getAxiosInstance();

export interface ImageUploadResponse {
  message: string;
  imageUrl: string;
}

/**
 * Sube una imagen de perfil para un usuario
 * @param userId - ID del usuario
 * @param file - Archivo de imagen (máx 5MB)
 * @returns URL de la imagen subida
 */
export const uploadUserProfileImage = async (
  userId: number,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post<ImageUploadResponse>(
    `${BASE_URL}/api/users/${userId}/profile-image`,
    formData
  );

  return response.data.imageUrl;
};

/**
 * Sube una imagen para un torneo
 * @param tournamentId - ID del torneo
 * @param file - Archivo de imagen (máx 5MB)
 * @returns URL de la imagen subida
 */
export const uploadTournamentImage = async (
  tournamentId: number,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post<ImageUploadResponse>(
    `${BASE_URL}/api/tournaments/${tournamentId}/image`,
    formData
  );

  return response.data.imageUrl;
};

/**
 * Valida que el archivo sea una imagen válida
 * @param file - Archivo a validar
 * @returns true si es válido, mensaje de error si no lo es
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Validar que sea una imagen
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "El archivo debe ser una imagen" };
  }

  // Validar tamaño máximo (5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    return { valid: false, error: "La imagen no debe superar los 5MB" };
  }

  return { valid: true };
};
