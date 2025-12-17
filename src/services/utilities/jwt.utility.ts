/**
 * Decodifica un token JWT y retorna el payload
 */
export const decodeJWT = <T = any>(token: string): T | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload) as T;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

/**
 * Verifica si un token JWT ha expirado
 * @param token - El token JWT a verificar
 * @returns true si el token ha expirado, false en caso contrario
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT<{ exp?: number }>(token);
  
  if (!payload || !payload.exp) {
    return true; // Si no se puede decodificar o no tiene exp, considerarlo expirado
  }
  
  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp;
};

/**
 * Obtiene el tiempo restante hasta la expiración del token en segundos
 * @param token - El token JWT
 * @returns Segundos hasta la expiración, o 0 si ya expiró
 */
export const getTokenExpirationTime = (token: string): number => {
  const payload = decodeJWT<{ exp?: number }>(token);
  
  if (!payload || !payload.exp) {
    return 0;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = payload.exp - now;
  
  return timeRemaining > 0 ? timeRemaining : 0;
};
