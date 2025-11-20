import axios from "axios";
import { loadAbort } from "./utilities/loadAbort.utility";
import type { User, UseApiCall, UserRegister, UserLogin, ApiResponse, AuthData } from "../models";
import type { UserDetails } from "../models/userDetails.model";
import type { UserFind } from "../models/userFind.model";


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

export const getUsersByIdAndEmail = (user: UserFind): UseApiCall<UserDetails> => {
    const controller = loadAbort();
    console.log('user', user)
    const call = axios.get<UserDetails>(
        `${BASE_URL}/api/users`,
        {
            params: { id: user.id, email: user.email },
            signal: controller.signal,
        }
    );

    return { call, controller };
};
export const updateUserDetails = (user: UserDetails): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axios.put<ApiResponse>(`${BASE_URL}/api/users/profile`, user, { signal: controller.signal }),
        controller,
    }
};