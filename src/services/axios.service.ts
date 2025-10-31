import axios, { Axios, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

let axiosInstace: AxiosInstance;
const createAxios = (baseURL: string) => {
    axiosInstace = axios.create({ baseURL })
}

const setupInterceptors = () => {
    axiosInstace.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.get("token");
            if (token) {
                config.headers.set(`Authorization Bearer: ${token}`)
            }
            console.log(`Request made to: ${config.url}`)
            return config;
        },
        (error) => {
            return Promise.reject(error)
        }
    );

    axiosInstace.interceptors.response.use(
        (response: AxiosResponse) => {
            console.log(`Response from : ${response.config.url}`)
            return response;
        }
    );
}

export const initAxios = () => {
    createAxios('localhost:8080');
    setupInterceptors();
    return axiosInstace;
}
