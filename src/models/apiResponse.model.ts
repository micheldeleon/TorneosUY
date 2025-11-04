export interface ApiResponse<T = unknown> {
    success: boolean              // indica si la petición fue exitosa
    message?: string              // mensaje del backend, opcional
    data?: T                      // payload real de la respuesta
    errors?: Record<string, any>  // errores de validación u otros
    statusCode?: number           // código HTTP (por si el backend lo incluye)
    timestamp?: string            // útil para logs o debugging
    pagination?: {
        total: number
        page: number
        pageSize: number
        totalPages: number
    }
}