import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

let axiosInstance: AxiosInstance | null = null;
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
                config.headers.set("Authorization", `Bearer ${token}`);
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error) => Promise.reject(error)
    );
};

export const initAxios = (baseURL = "http://localhost:8080") => {
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
