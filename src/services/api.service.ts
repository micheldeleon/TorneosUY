import axios from "axios";

import { loadAbort } from "./utilities/loadAbort.utility";
import type { User } from "../models/user.model";
import type { UseApiCall } from "../models/useApi.model";
import type { UserRegister } from "../models/userRegister.model";
import type { UserLogin } from "../models/userLogin.model";
import type { AuthResponse } from "../models/auth.model";

const BASE_URL = "http://localhost:8080";
export type ApiResponse = {
    status: number;
    message?: string;
}

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
export const postLogin = (user: UserLogin): UseApiCall<AuthResponse> => {
    const controller = loadAbort();
    return {
        call: axios.post<AuthResponse>(`${BASE_URL}/login`, user, { signal: controller.signal }),
        controller,
    }
};
