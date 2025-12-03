import { loadAbort } from "./utilities/loadAbort.utility";
import { getAxiosInstance } from "./axios.service";
import type { User, UseApiCall, UserRegister, UserLogin, ApiResponse, AuthData, CreateTournament, UserDetails, TournamentDetails, UserFind, TournamentCreated } from "../models";
import axios from "axios";


const BASE_URL = "http://localhost:8080";
const axiosInstance = getAxiosInstance();


export const getUsers = (): UseApiCall<User> => {
    const controller = loadAbort();
    return {
        call: axios.get<User>(`${BASE_URL}/api/users`, { signal: controller.signal }),
        controller,
    }
};
export const postRegister = (user?: UserRegister): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axios.post<ApiResponse>(`${BASE_URL}/api/users/register`, user, { signal: controller.signal }),
        controller,
    }
};
export const postLogin = (user?: UserLogin): UseApiCall<AuthData> => {
    const controller = loadAbort();
    return {
        call: axios.post<AuthData>(`${BASE_URL}/login`, user, { signal: controller.signal }),
        controller,
    }
};

export const getUsersByIdAndEmail = (user?: UserFind): UseApiCall<UserDetails> => {
    const controller = loadAbort();

    if (!user) {
        throw new Error("User params missing in getUsersByIdAndEmail");
    }

    console.log('user', user)
    const call = axiosInstance.get<UserDetails>(
        `${BASE_URL}/api/users`,
        {
            params: { id: user.id, email: user.email },
            signal: controller.signal,
        }
    );

    return { call, controller };
};

export const getUserDetailsById = (id?: number): UseApiCall<UserDetails> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<UserDetails>(`${BASE_URL}/api/users?id=${id}`, { signal: controller.signal }),
        controller,
    }
};;

export const updateUserDetails = (user?: UserDetails): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axios.put<ApiResponse>(`${BASE_URL}/api/users/profile`, user, { signal: controller.signal }),
        controller,
    }
};

export const getDisciplines = (): UseApiCall<any[]> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<any[]>(`${BASE_URL}/api/disciplines`, {
            signal: controller.signal,
        }),
        controller,
    };
};

export const getFormatsByDiscipline = (disciplineId?: string): UseApiCall<any[]> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<any[]>(
            `${BASE_URL}/api/disciplines/${disciplineId}/formats`,
            { signal: controller.signal }
        ),
        controller,
    };
};

export const getAllTournaments = (): UseApiCall<any[]> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<any[]>(`${BASE_URL}/api/tournaments/all`, {
            signal: controller.signal,
        }),
        controller,
    };
};

export const getTournamentById = (id?: number): UseApiCall<TournamentDetails> => {
    const controller = loadAbort();

    if (!id) throw new Error("Tournament id is required");

    const call = axiosInstance.get<TournamentDetails>(
        `/api/tournaments/${id}`,
        { signal: controller.signal }
    );

    return { call, controller };
};

export const createTournament = (
    params?: { organizerId: number; tournament: CreateTournament }
): UseApiCall<TournamentCreated> => {

    const controller = loadAbort();

    return {
        call: axiosInstance.post<TournamentCreated>(
            `/api/tournaments/organizer/${params?.organizerId}`,
            params?.tournament,
            { signal: controller.signal }
        ),
        controller
    };
};


