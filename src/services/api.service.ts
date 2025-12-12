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

export const requestOrganizerPermission = (userId?: number): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(`/api/users/organizer?id=${userId}`, { signal: controller.signal }),
        controller,
    }
}

export const registerTeam = (
    params?: {
        tournamentId: number;
        data: {
            userId: number;
            teamName: string;
            participants: {
                fullName: string;
                nationalId: string;
            }[];
        }
    }
): UseApiCall<ApiResponse> => {

    const controller = loadAbort();

    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/register/team`,
            params?.data,
            { signal: controller.signal }
        ),
        controller,
    };
};


// export const registerIndividual = (
//     params?: {
//         tournamentId: number;
//         data: {
//             userId: number;
//             fullName: string;
//             nationalId: string;
//         }
//     }
// ): UseApiCall<ApiResponse> => {
//     const controller = loadAbort();
//     return {
//         call: axiosInstance.post<ApiResponse>(
//             `/api/tournaments/${params?.tournamentId}/register`,
//             params?.data,
//             { signal: controller.signal }
//         ),
//         controller,
//     };
// };  

export const getTournamentFixtures = (tournamentId?: number): UseApiCall<any> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<any>(`/api/tournaments/${tournamentId}/fixture`, { signal: controller.signal }),
        controller,
    };
}

export const getTournamentStandings = (tournamentId?: number): UseApiCall<any> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<any>(`/api/tournaments/${tournamentId}/standings`, { signal: controller.signal }),
        controller,
    };
}

export const cancelTournament = (tournamentId?: number): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(`/api/tournaments/${tournamentId}/cancel`, { signal: controller.signal }),
        controller,
    };
}

export const setResultForMatchEliminatorio = (
    params?: {
        tournamentId: number;
        matchId: number;
        result: {
            scoreHome: number;
            scoreAway: number;
            winnerTeamId: number;
        }
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/matches/${params?.matchId}/result`,
            params?.result,
            { signal: controller.signal }
        ),
        controller,
    };
}

export const setResultForMatchLiga = (
    params?: {
        tournamentId: number;
        matchId: number;
        result: {
            scoreHome: number;
            scoreAway: number;
        }
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/matches/${params?.matchId}/league-result`,
            params?.result,
            { signal: controller.signal }
        ),
        controller,
    };
}

export const generateFixtureForLeague = (
    params?: {
        tournamentId: number;
        isDoubleRound?: boolean;
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/fixture/league?doubleRound=${params?.isDoubleRound ? true : false}`,
            {},
            { signal: controller.signal }
        ),
        controller,
    };
}

export const generateFixtureForEliminatory = (
    params?: {
        tournamentId: number;
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/fixture/elimination`,
            {},
            { signal: controller.signal }
        ),
        controller,
    };
}