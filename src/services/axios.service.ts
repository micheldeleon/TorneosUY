import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { isTokenExpired } from "./utilities/jwt.utility";

let axiosInstance: AxiosInstance | null = null;
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const createAxios = (baseURL: string) => {
    axiosInstance = axios.create({ baseURL });
};

const setupInterceptors = () => {
    if (!axiosInstance) {
        throw new Error("Axios instance not initialized");
    }

    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("token");
            if (token) {
                // Verificar si el token ha expirado antes de hacer la petición
                if (isTokenExpired(token)) {
                    console.warn('Token expirado detectado en interceptor, limpiando sesión...');
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // Redirigir al login
                    window.location.href = '/login';
                    return Promise.reject(new Error('Token expirado'));
                }
                config.headers.set("Authorization", `Bearer ${token}`);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => {
            // Si el servidor responde con 401 (Unauthorized), también cerrar sesión
            if (error.response && error.response.status === 401) {
                console.warn('Respuesta 401 recibida, limpiando sesión...');
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

export const initAxios = (baseURL = DEFAULT_BASE_URL) => {
    if (axiosInstance) {
        return axiosInstance;
    }
    createAxios(baseURL);
    setupInterceptors();
    return axiosInstance!;
};

export const getAxiosInstance = () => {
    return initAxios();
};
