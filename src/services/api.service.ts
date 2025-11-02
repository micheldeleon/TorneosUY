import axios from "axios";

import { loadAbort } from "./utilities/loadAbort.utility";
import type { User } from "../models/user.model";
import type { UseApiCall } from "../models/useApi.model";
import type { UserRegister } from "../models/userRegister.model";
import type { UserLogin } from "../models/userLogin.model";

const BASE_URL = "http://localhost:8080";

export const getUsers = (): UseApiCall<User> => {
    const controller = loadAbort();
    return {
        call: axios.get<User>(`${BASE_URL}/api/users`, { signal: controller.signal }),
        controller,
    }
};
export const postRegister = (user: UserRegister): UseApiCall<UserRegister> => {
    const controller = loadAbort();
    return {
        call: axios.post<UserRegister>(`${BASE_URL}/users/register`, user,{ signal: controller.signal }),
        controller,
    }
};
export const postLogin = (user: UserLogin): UseApiCall<UserLogin> => {
    const controller = loadAbort();
    return {
        call: axios.post<UserLogin>(`${BASE_URL}/login`, user,{ signal: controller.signal }),
        controller,
    }
};
