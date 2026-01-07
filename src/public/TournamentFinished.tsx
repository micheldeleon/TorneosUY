import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import {
    Home,
    Search,
    Sparkles,
    Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails } from "../models";
import { getTournamentById, getTournamentFixtures, getTournamentStandings, rateOrganizer, getUserDetailsById } from "../services/api.service";
import { useGlobalContext } from "../context/global.context";
import { RateOrganizerModal } from "../components/Reputation";
import { OrganizerReputation } from "../components/Reputation";
import { SplashScreen } from "./SplashScreen";
import { TablaPosiciones } from "../components/Tournament/TablaPosiciones";
import { FixtureLiga } from "../components/Tournament/FixtureLiga";
import { BracketEliminatoria } from "../components/Tournament/BracketEliminatoria";
import { RankingCarrera } from "../components/Tournament/RankingCarrera";

type FormatoTorneo = "Liga" | "Eliminatorio" | "Carrera" | "Battle Royale";

// Helper function to transform standings into table format
function transformStandingsToTable(standings: any[]) {
    if (!standings || standings.length === 0) return [];

    return standings.map((team, index) => ({
        posicion: index + 1,
        equipo: team.teamName,
        pj: team.played,
        pg: team.won,
        pe: team.draw,
        pp: team.lost,
        gf: team.goalsFor,
        gc: team.goalsAgainst,
        pts: team.points,
    }));
}

// Helper function to transform fixtures into league format
function transformFixturesToLeague(fixtures: any[]) {
    if (!fixtures || fixtures.length === 0) return [];

    // Group fixtures by round (jornada)
    const fixturesByRound = fixtures.reduce((acc, fixture) => {
        const round = fixture.round;
        if (!acc[round]) acc[round] = [];
        acc[round].push(fixture);
        return acc;
    }, {} as Record<number, any[]>);

    // Transform to league jornadas structure
    return Object.entries(fixturesByRound)
        .sort(([roundA], [roundB]) => Number(roundA) - Number(roundB))
        .map(([round, matchesInRound]) => ({
            numero: Number(round),
            partidos: (matchesInRound as any[]).map(match => ({
                id: match.id,
                equipoLocal: match.homeTeam?.name || "",
                equipoVisitante: match.awayTeam?.name || "",
                resultadoLocal: match.scoreHome ?? undefined,
                resultadoVisitante: match.scoreAway ?? undefined,
                fecha: match.scheduledAt ? new Date(match.scheduledAt).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' }) : undefined,
                hora: match.scheduledAt ? new Date(match.scheduledAt).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) : undefined,
                estado: (match.status === "FINISHED" ? "jugado" : "pendiente") as "jugado" | "pendiente" | "en_vivo",
            }))
        }));
}

function transformFixturesToBracket(fixtures: any[]) {
    if (!fixtures || fixtures.length === 0) return [];

    // Group fixtures by round
    const fixturesByRound = fixtures.reduce((acc, fixture) => {
        const round = fixture.round;
        if (!acc[round]) acc[round] = [];
        acc[round].push(fixture);
        return acc;
    }, {} as Record<number, any[]>);

    const sortedRounds = Object.entries(fixturesByRound)
        .sort(([roundA], [roundB]) => Number(roundA) - Number(roundB));

    const getRoundName = (matchCount: number): string => {
        if (matchCount >= 256) return "Ciento veintiochoavos de Final";
        if (matchCount >= 128) return "Sesentaicuatroavos de Final";
        if (matchCount >= 64) return "Treintaidosavos de Final";
        if (matchCount >= 32) return "Dieciseisavos de Final";
        if (matchCount >= 16) return "Octavos de Final";
        if (matchCount === 4) return "Cuartos de Final";
        if (matchCount === 2) return "Semifinales";
        if (matchCount === 1) return "Final";
        return `Ronda ${matchCount} equipos`;
    };

    const etapas = sortedRounds.map(([, matchesInRound]) => ({
        nombre: getRoundName((matchesInRound as any[]).length),
        duelos: (matchesInRound as any[]).map(match => ({
            id: match.id,
            equipo1: match.homeTeam?.name || "",
            equipo2: match.awayTeam?.name || "",
            resultado1: match.scoreHome ?? undefined,
            resultado2: match.scoreAway ?? undefined,
            ganador: match.winnerTeam?.name || "",
            estado: (match.status === "FINISHED" ? "jugado" : "pendiente") as "jugado" | "pendiente" | "en_vivo",
        }))
    }));

    // Find the last finished match to get the champion
    const lastFinishedMatch = fixtures
        .sort((a, b) => b.round - a.round)
        .find(m => m.status === "FINISHED" && m.winnerTeam);

    // Add champion stage if there's a winner
    if (lastFinishedMatch?.winnerTeam) {
        etapas.push({
            nombre: "Campeón",
            duelos: [{
                id: 9999,
                equipo1: lastFinishedMatch.winnerTeam.name,
                equipo2: undefined,
                resultado1: undefined,
                resultado2: undefined,
                ganador: lastFinishedMatch.winnerTeam.name,
                estado: "jugado" as const,
            }]
        });
    }

    return etapas;
}

export default function TournamentFinished() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useGlobalContext();

    const { data: t, loading, error, fetch } = useApi<TournamentDetails, number>(getTournamentById);
    const { data: fixturesData, fetch: fetchFixtures } = useApi<any, number>(getTournamentFixtures);
    const { data: standingsData, fetch: fetchStandings } = useApi<any, number>(getTournamentStandings);
    const { fetch: rateOrganizerFetch } = useApi(rateOrganizer);
    const { data: userDetails, fetch: fetchUserDetails } = useApi(getUserDetailsById);

    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' });

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type, message: '' }), 3000);
    };

    // Check if user participated - verify multiple possible data structures
    const userParticipated = userDetails && t?.teams?.some((team: any) => {
        // Check if team has participants array
        if (team.participants && Array.isArray(team.participants)) {
            return team.participants.some((p: any) => {
                // Compare by nationalId (cedula)
                if (userDetails.nationalId && p.nationalId === userDetails.nationalId) {
                    return true;
                }
                // Compare by fullName as fallback
                const userFullName = `${userDetails.name} ${userDetails.lastName}`.trim();
                if (p.fullName && p.fullName === userFullName) {
                    return true;
                }
                return false;
            });
        }
        return false;
    });

    // Debug logging
    console.log('Debug - User:', user?.id);
    console.log('Debug - User Details:', userDetails);
    console.log('Debug - Tournament:', t?.id);
    console.log('Debug - Organizer:', t?.organizerId);
    console.log('Debug - Teams:', t?.teams);
    console.log('Debug - User Participated:', userParticipated);

    const canRate = user && t && userParticipated && user.id !== t.organizerId;
    
    console.log('Debug - Can Rate:', canRate);

    const handleRateSubmit = async (score: number, comment?: string) => {
        if (!t || !user || !t.organizerId) return;

        try {
            await rateOrganizerFetch({
                organizerId: t.organizerId,
                data: {
                    tournamentId: t.id,
                    score,
                    comment
                }
            });
            showNotification('success', '¡Gracias por tu calificación! Tu opinión ayuda a mejorar la comunidad.');
            setIsRatingModalOpen(false);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.response?.data || 'Error al enviar la calificación';
            showNotification('error', errorMessage);
        }
    };

    useEffect(() => {
        if (id) {
            fetch(Number(id));
        }
    }, [id, fetch]);

    // Fetch user details when user is available
    useEffect(() => {
        if (user?.id) {
            fetchUserDetails(user.id);
        }
    }, [user?.id, fetchUserDetails]);

    // Fetch fixtures if tournament format is "Eliminatorio" or "Liga"
    useEffect(() => {
        if (t?.id && (t.format.name === "Eliminatorio" || t.format.name === "Liga")) {
            fetchFixtures(t.id);
        }
    }, [t?.id, t?.format.name, fetchFixtures]);

    // Fetch standings if tournament format is "Liga"
    useEffect(() => {
        if (t?.id && t.format.name === "Liga") {
            fetchStandings(t.id);
        }
    }, [t?.id, t?.format.name, fetchStandings]);

    useEffect(() => {
        if (t && t.status === "INICIADO") {
            navigate(`/torneo-iniciado/${t.id}`);
        } else if (t && t.status === "CANCELADO") {
            navigate(`/torneo-cancelado/${t.id}`);
        } else if (t && t.status === "ABIERTO") {
            navigate(`/torneo/${t.id}`);
        }
    }, [t, navigate]);

    // Loading state
    if (loading || !t) {
        return <SplashScreen />;
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen grid place-items-center text-rose-300 bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
                <div className="text-center">
                    <p className="mb-4">Error al cargar el torneo</p>
                    <Button onClick={() => navigate(-1)} variant="outline" className="text-purple-300 border-purple-600">
                        Volver
                    </Button>
                </div>
            </div>
        );
    }

    // Determinar el formato
    const formatoEnUso: FormatoTorneo = t.format.name as FormatoTorneo;

    return (
        <div className="min-h-screen bg-gradient-to-b from-surface-dark via-[#1a0a2a] to-surface-dark flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

            <div className="relative max-w-4xl w-full z-10">
                {/* Contenido principal */}
                <div className="p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8 mt-20">

                    {/* Título y descripción */}
                    <div className="text-center space-y-3 sm:space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            ¡Torneo Completado!
                        </h2>
                        <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200">
                            {t.name}
                        </h4>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            Este torneo ha llegado a su fin. Todos los participantes han competido y ya tenemos ganadores oficiales.
                            ¡Gracias por ser parte de esta increíble competencia!
                        </p>
                    </div>

                    {/* Mensaje destacado */}
                    <Card className="bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-surface-dark/10 border border-purple-500/20 p-4 sm:p-6 backdrop-blur-sm">
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="bg-gradient-to-br from-yellow-500/20 to-purple-500/20 p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-purple-200 mb-2 text-sm sm:text-base">¡Gracias por participar!</h3>
                                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                                    Este torneo fue un éxito gracias a jugadores como tú. Los resultados finales, estadísticas y highlights están disponibles para revisar.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                                        Revisa la tabla final
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                        Consulta estadísticas
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                        Comparte tus logros
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* Resultados del torneo */}
                    <div className="space-y-4">
                        <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Resultados Finales</h3>
                            <p className="text-gray-400 text-sm">Consulta el desempeño de todos los participantes</p>
                        </div>

                        {/* Liga - Mostrar tabla y fixture */}
                        {formatoEnUso === "Liga" && (
                            <div className="space-y-4">
                                <TablaPosiciones posiciones={transformStandingsToTable(standingsData)} />
                                <FixtureLiga jornadas={transformFixturesToLeague(fixturesData)} />
                            </div>
                        )}

                        {/* Eliminatoria - Mostrar bracket */}
                        {formatoEnUso === "Eliminatorio" && (
                            <div className="overflow-x-auto">
                                <BracketEliminatoria etapas={transformFixturesToBracket(fixturesData)} />
                            </div>
                        )}

                        {/* Carrera / Battle Royale - Mostrar ranking */}
                        {(formatoEnUso === "Carrera" || formatoEnUso === "Battle Royale") && (
                            <div className="overflow-x-auto">
                                <RankingCarrera competidores={[]} />
                            </div>
                        )}
                    </div>
                    {/* Organizer Reputation */}
                    {t.organizerId && (
                        <div className="space-y-4">
                            <OrganizerReputation organizerId={t.organizerId} />
                            {canRate && (
                                <Card className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 border border-yellow-500/20 p-6">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex-1">
                                            <h3 className="text-white font-semibold mb-1">¿Cómo fue tu experiencia?</h3>
                                            <p className="text-gray-400 text-sm">Ayuda a otros jugadores calificando al organizador</p>
                                        </div>
                                        <Button
                                            onClick={() => setIsRatingModalOpen(true)}
                                            className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white"
                                        >
                                            <Star className="w-4 h-4 mr-2" />
                                            Calificar Organizador
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}                </div>
                {/* Sugerencias */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <Card onClick={() => navigate('/torneos')} className="bg-gray-900/50 border-purple-500/20 p-4 sm:p-5 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                                <div className="p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200 mb-1 text-sm sm:text-base">Nuevos Torneos</h3>
                                    <p className="text-xs text-gray-400">Explora más competencias</p>
                                </div>
                            </div>
                        </Card>

                        <Card onClick={() => navigate('/')} className="bg-gray-900/50 border-purple-500/20 p-4 sm:p-5 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                                <div className="p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform">
                                    <Home className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-200 mb-1 text-sm sm:text-base">Inicio</h3>
                                    <p className="text-xs text-gray-400">Vuelve a la página principal</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                {/* Rate Organizer Modal */}
                {t && canRate && (
                    <RateOrganizerModal
                        isOpen={isRatingModalOpen}
                        onClose={() => setIsRatingModalOpen(false)}
                        onSubmit={handleRateSubmit}
                        organizerName="Organizador"
                        tournamentName={t.name}
                    />
                )}

                {/* Notification Overlay */}
                {notification.show && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
                        <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-[#1a1a1a] border border-gray-800">
                            <div className="text-center">
                                {notification.type === 'success' ? (
                                    <Star className="w-20 h-20 text-yellow-400 mx-auto mb-4 fill-yellow-400" />
                                ) : (
                                    <div className="w-20 h-20 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-rose-400 text-4xl">✕</span>
                                    </div>
                                )}
                                <h3 className={`text-2xl font-bold mb-2 ${notification.type === 'success' ? 'text-yellow-400' : 'text-rose-400'}`}>
                                    {notification.type === 'success' ? '¡Éxito!' : 'Error'}
                                </h3>
                                <p className="text-white text-lg">{notification.message}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
