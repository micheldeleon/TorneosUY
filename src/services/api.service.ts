import { loadAbort } from "./utilities/loadAbort.utility";
import { getAxiosInstance } from "./axios.service";
import type { User, UseApiCall, UserRegister, UserLogin, ApiResponse, AuthData, CreateTournament, UserDetails, TournamentDetails, UserFind, TournamentCreated, UpdateTournamentRequest } from "../models";
import axios from "axios";


const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? "" : "http://localhost:8080");
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");
const LOGIN_URL = BASE_URL.includes("localhost") || BASE_URL.includes("127.0.0.1")
    ? `${BASE_URL}/login`
    : "/api/login";
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
        call: axios.post<AuthData>(LOGIN_URL, user, { signal: controller.signal }),
        controller,
    }
};

export const postLoginWithGoogle = (googleIdToken?: string): UseApiCall<AuthData> => {
    const controller = loadAbort();

    if (!googleIdToken) {
        throw new Error("Google ID token is required");
    }

    return {
        call: axiosInstance.post<AuthData>(
            `${LOGIN_URL}/google`,
            {},
            {
                headers: { Authorization: `Bearer ${googleIdToken}` },
                signal: controller.signal,
            }
        ),
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

export const changePassword = (userId: string, currentPassword: string, newPassword: string): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.put<ApiResponse>(
            `${BASE_URL}/api/users/${userId}/change-password`,
            { currentPassword, newPassword },
            { signal: controller.signal }
        ),
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

export const getLatestTournaments = (): UseApiCall<TournamentDetails[]> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<TournamentDetails[]>(`${BASE_URL}/api/tournaments/latest`, {
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

export const updateTournament = (
    params?: { tournamentId: number; data: UpdateTournamentRequest }
): UseApiCall<TournamentDetails> => {
    const controller = loadAbort();

    if (!params?.tournamentId) {
        throw new Error("Tournament ID is required");
    }

    return {
        call: axiosInstance.put<TournamentDetails>(
            `/api/tournaments/${params.tournamentId}`,
            params.data,
            { signal: controller.signal }
        ),
        controller
    };
};

export const requestOrganizerPermission = (userId?: number): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/users/organizer`,
            {},
            { params: { id: userId }, signal: controller.signal }
        ),
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

export const startTournament = (tournamentId?: number): UseApiCall<{
    tournamentId: number;
    status: string;
    startedAt: string;
    startedBy: string;
    participantsCount: number;
    message: string;
}> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<{
            tournamentId: number;
            status: string;
            startedAt: string;
            startedBy: string;
            participantsCount: number;
            message: string;
        }>(`/api/tournaments/${tournamentId}/start`, {}, { signal: controller.signal }),
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

export const getUserOrganizedTournaments = (params?: { id: number; email: string }): UseApiCall<TournamentDetails[]> => {
    const controller = loadAbort();
    
    if (!params) {
        throw new Error("User params missing in getUserOrganizedTournaments");
    }

    return {
        call: axiosInstance.get<TournamentDetails[]>(
            `/api/users/tournaments/organized`,
            {
                params: { id: params.id, email: params.email },
                signal: controller.signal,
            }
        ),
        controller,
    };
}

export const getUserParticipatingTournaments = (params?: { id: number; email: string }): UseApiCall<TournamentDetails[]> => {
    const controller = loadAbort();
    
    if (!params) {
        throw new Error("User params missing in getUserParticipatingTournaments");
    }

    return {
        call: axiosInstance.get<TournamentDetails[]>(
            `/api/users/tournaments`,
            {
                params: { id: params.id, email: params.email },
                signal: controller.signal,
            }
        ),
        controller,
    };
}

export const registerToTournament = (
    params?: {
        tournamentId: number;
        userId: number;
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/register`,
            { userId: params?.userId },
            { signal: controller.signal }
        ),
        controller,
    };
}

export const registerRunnerToTournament = (
    params?: {
        tournamentId: number;
        request?: {
            teamName?: string;
            bibNumber?: string;
            category?: string;
        }
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/register/runner`,
            params?.request || {},
            { signal: controller.signal }
        ),
        controller,
    };
}

export const reportRaceResults = (
    params?: {
        tournamentId: number;
        results: {
            teamId: number;
            timeMillis: number;
        }[]
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/race/results`,
            params?.results,
            { signal: controller.signal }
        ),
        controller,
    };
}

export const getRaceResults = (tournamentId?: number): UseApiCall<{
    teamId: number;
    teamName: string;
    timeMillis: number;
    position: number;
}[]> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<{
            teamId: number;
            teamName: string;
            timeMillis: number;
            position: number;
        }[]>(`/api/tournaments/${tournamentId}/race/results`, { signal: controller.signal }),
        controller,
    };
}

export const removeTeamFromTournament = (
    params?: {
        tournamentId: number;
        data: {
            organizerId: number;
            teamId: number;
            comment?: string;
        }
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/remove-team`,
            params?.data,
            { signal: controller.signal }
        ),
        controller,
    };
}

// Notifications
export const getAllNotifications = (): UseApiCall<import("../models").NotificationResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<import("../models").NotificationResponse>(`/api/notifications`, { signal: controller.signal }),
        controller,
    };
}

export const getUnreadNotifications = (): UseApiCall<any[]> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<any[]>(`/api/notifications/unread`, { signal: controller.signal }),
        controller,
    };
}

export const getUnreadNotificationsCount = (): UseApiCall<{ count: number }> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<{ count: number }>(`/api/notifications/unread/count`, { signal: controller.signal }),
        controller,
    };
}

export const markNotificationAsRead = (notificationId?: number): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.put<ApiResponse>(`/api/notifications/${notificationId}/read`, {}, { signal: controller.signal }),
        controller,
    };
}

export const markAllNotificationsAsRead = (): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.put<ApiResponse>(`/api/notifications/read-all`, {}, { signal: controller.signal }),
        controller,
    };
}

// Organizer Reputation
export const rateOrganizer = (
    params?: {
        organizerId: number;
        data: {
            tournamentId: number;
            score: number;
            comment?: string;
        }
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<ApiResponse>(
            `/api/organizers/${params?.organizerId}/rate`,
            params?.data,
            { signal: controller.signal }
        ),
        controller,
    };
}

export const getOrganizerReputation = (organizerId?: number): UseApiCall<{
    organizerId: number;
    organizerName: string;
    averageScore: number;
    totalRatings: number;
    distribution: {
        fiveStars: number;
        fourStars: number;
        threeStars: number;
        twoStars: number;
        oneStars: number;
    };
    recentRatings: Array<{
        userName: string;
        tournamentName: string;
        score: number;
        comment: string | null;
        createdAt: string;
    }>;
}> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.get<{
            organizerId: number;
            organizerName: string;
            averageScore: number;
            totalRatings: number;
            distribution: {
                fiveStars: number;
                fourStars: number;
                threeStars: number;
                twoStars: number;
                oneStars: number;
            };
            recentRatings: Array<{
                userName: string;
                tournamentName: string;
                score: number;
                comment: string | null;
                createdAt: string;
            }>;
        }>(`/api/organizers/${organizerId}/reputation`, { signal: controller.signal }),
        controller,
    };
}

export const finalizeTournament = (tournamentId?: number): UseApiCall<{
    message: string;
    tournamentId: number;
    status: string;
}> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.post<{
            message: string;
            tournamentId: number;
            status: string;
        }>(`/api/tournaments/${tournamentId}/finalize`, {}, { signal: controller.signal }),
        controller,
    };
}

// Withdraw from tournament - for teams
export const withdrawTeamFromTournament = (
    params?: {
        tournamentId: number;
        teamId?: number;
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.delete<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/withdraw/team`,
            { signal: controller.signal }
        ),
        controller,
    };
};

// Withdraw from tournament - for runners (carrera format)
export const withdrawRunnerFromTournament = (
    params?: {
        tournamentId: number;
    }
): UseApiCall<ApiResponse> => {
    const controller = loadAbort();
    return {
        call: axiosInstance.delete<ApiResponse>(
            `/api/tournaments/${params?.tournamentId}/withdraw/runner`,
            { signal: controller.signal }
        ),
        controller,
    };
};
