import axios from "axios";
import { loadAbort } from "./utilities/loadAbort.utility";
import type { User } from "../models/user.model";
import type { UseApiCall } from "../models/useApi.model";

const BASE_URL = "http://localhost:8080";

export const getUsers = (): UseApiCall<User[]> => {
    const controller = loadAbort();
    return {
        call: axios.get<User[]>(`${BASE_URL}/api/users`, { signal: controller.signal }),
        controller,
    }
};