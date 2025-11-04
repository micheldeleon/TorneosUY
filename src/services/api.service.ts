import axios from "axios";
import { loadAbort } from "./utilities/loadAbort.utility";
import type { User, UseApiCall, UserRegister, UserLogin, ApiResponse, AuthData } from "../models";


const BASE_URL = "http://localhost:8080";


export const getUsers = (): UseApiCall<User> => {
    const controller = loadAbort();
    return {
        call: axios.get<User>(`${BASE_URL}/api/users`, { signal: controller.signal }),
        controller,
    }
};
export const postRegister = (user: UserRegister): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axios.post<ApiResponse>(`${BASE_URL}/api/users/register`, user, { signal: controller.signal }),
        controller,
    }
};
export const postLogin = (user: UserLogin): UseApiCall<AuthData> => {
    const controller = loadAbort();
    return {
        call: axios.post<AuthData>(`${BASE_URL}/login`, user, { signal: controller.signal }),
        controller,
    }
};
