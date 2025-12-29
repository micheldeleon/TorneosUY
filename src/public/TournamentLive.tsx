import { useParams, useNavigate } from "react-router-dom";
import {
    Trophy, Calendar, Users, ArrowLeft, Phone, Star,
    Award, Shield, Target, Play, FileText
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Separator } from "../components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { TablaPosiciones } from "../components/Tournament/TablaPosiciones";
import { FixtureLiga } from "../components/Tournament/FixtureLiga.tsx";
import { BracketEliminatoria } from "../components/Tournament/BracketEliminatoria";
import { ListaParticipantes } from "../components/Tournament/ListaParticipantes";
import { useEffect } from "react";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails, UserDetails } from "../models";
import { getTournamentById, getUserDetailsById, getTournamentFixtures, getTournamentStandings } from "../services/api.service";
import { RankingCarrera } from "../components/Tournament/RankingCarrera.tsx";
import { SplashScreen } from "./SplashScreen.tsx";

type FormatoTorneo = "Liga" | "Eliminatorio" | "Carrera" | "Battle Royale";

const MOCK_PARTICIPANTES = [
    { id: 1, nombre: "Equipaso FC", email: "equipaso@example.com", estado: "activo" as const, posicion: 1, equipo: "Grupo A" },
    { id: 2, nombre: "Los Tigres", email: "tigres@example.com", estado: "activo" as const, posicion: 2, equipo: "Grupo A" },
    { id: 3, nombre: "Real Cracks", email: "realcracks@example.com", estado: "activo" as const, posicion: 3, equipo: "Grupo A" },
    { id: 4, nombre: "United Stars", email: "united@example.com", estado: "activo" as const, posicion: 4, equipo: "Grupo A" },
    { id: 5, nombre: "Juventud FC", email: "juventud@example.com", estado: "activo" as const, posicion: 5, equipo: "Grupo B" },
    { id: 6, nombre: "Pelota de Trapo", email: "pelota@example.com", estado: "activo" as const, posicion: 6, equipo: "Grupo B" },
    { id: 7, nombre: "Los Campeones", email: "campeones@example.com", estado: "activo" as const, posicion: 7, equipo: "Grupo B" },
    { id: 8, nombre: "Deportivo MVD", email: "deportivo@example.com", estado: "activo" as const, posicion: 8, equipo: "Grupo B" },
];

function calculateEliminationStats(fixtures: any[]) {
    if (!fixtures || fixtures.length === 0) {
        return {
            totalMatches: 0,
            finishedMatches: 0,
            pendingMatches: 0,
            totalGoals: 0,
            averageGoals: 0,
            currentRound: "N/A",
            teamsRemaining: 0,
        };
    }

    const finishedMatches = fixtures.filter(f => f.status === "FINISHED").length;
    const pendingMatches = fixtures.filter(f => f.status !== "FINISHED").length;
    const totalMatches = fixtures.length;

    const totalGoals = fixtures.reduce((sum, match) => {
        const homeGoals = match.scoreHome ?? 0;
        const awayGoals = match.scoreAway ?? 0;
        return sum + homeGoals + awayGoals;
    }, 0);

    const averageGoals = finishedMatches > 0 ? (totalGoals / finishedMatches).toFixed(2) : "0";

    const pendingRounds = fixtures
        .filter(f => f.status !== "FINISHED")
        .map(f => f.round);
    const currentRound = pendingRounds.length > 0 ? Math.min(...pendingRounds) : Math.max(...fixtures.map(f => f.round));

    const getRoundName = (round: number): string => {
        const matchesInRound = fixtures.filter(f => f.round === round).length;
        if (matchesInRound >= 256) return "Ciento veintiochoavos";
        if (matchesInRound >= 128) return "Sesentaicuatroavos";
        if (matchesInRound >= 64) return "Treintaidosavos";
        if (matchesInRound >= 32) return "Dieciseisavos";
        if (matchesInRound >= 16) return "Octavos";
        if (matchesInRound === 4) return "Cuartos";
        if (matchesInRound === 2) return "Semifinales";
        if (matchesInRound === 1) return "Final";
        return `Ronda ${round}`;
    };

    return {
        totalMatches,
        finishedMatches,
        pendingMatches,
        totalGoals,
        averageGoals: parseFloat(averageGoals as string),
        currentRound: getRoundName(currentRound)
    };
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

    // Calculate round names based on number of matches per round
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

// Helper function to calculate league tournament statistics
function calculateLeagueStats(fixtures: any[], standings: any[]) {
    if (!fixtures || fixtures.length === 0) {
        return {
            totalMatches: 0,
            finishedMatches: 0,
            pendingMatches: 0,
            totalGoals: 0,
            averageGoals: 0,
            totalRounds: 0,
            currentRound: 0,
            leader: "N/A",
        };
    }

    const finishedMatches = fixtures.filter(f => f.status === "FINISHED").length;
    const pendingMatches = fixtures.filter(f => f.status !== "FINISHED").length;
    const totalMatches = fixtures.length;

    const totalGoals = fixtures.reduce((sum, match) => {
        if (match.status === "FINISHED") {
            const homeGoals = match.scoreHome ?? 0;
            const awayGoals = match.scoreAway ?? 0;
            return sum + homeGoals + awayGoals;
        }
        return sum;
    }, 0);

    const averageGoals = finishedMatches > 0 ? (totalGoals / finishedMatches).toFixed(2) : "0";


    const rounds = [...new Set(fixtures.map(f => f.round))].sort((a, b) => a - b);
    const totalRounds = rounds.length;


    const currentRound = rounds.find(round =>
        fixtures.some(f => f.round === round && f.status !== "FINISHED")
    ) || rounds[rounds.length - 1] || 0;


    const leader = standings && standings.length > 0 ? standings[0].teamName : "N/A";

    return {
        totalMatches,
        finishedMatches,
        pendingMatches,
        totalGoals,
        averageGoals: parseFloat(averageGoals as string),
        totalRounds,
        currentRound,
        leader,
    };
}

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

function formatCurrency(value: number) {
    return value === 0
        ? "Gratis"
        : new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(value);
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));
}

export function TournamentLive() {


    const { id } = useParams();
    const navigate = useNavigate();

    const { data: t, loading, error, fetch } = useApi<TournamentDetails, number>(getTournamentById);
    const { data: organizerData, fetch: fetchOrganizer } = useApi<UserDetails, number>(getUserDetailsById);
    const { data: fixturesData, fetch: fetchFixtures } = useApi<any, number>(getTournamentFixtures);
    const { data: standingsData, fetch: fetchStandings } = useApi<any, number>(getTournamentStandings);

    useEffect(() => {
        if (id) {
            fetch(Number(id));
        }
    }, [id, fetch]);

    // Fetch organizer details when organizerId is available
    useEffect(() => {
        if (t?.organizerId) {
            fetchOrganizer(t.organizerId);
        }
    }, [t?.organizerId, fetchOrganizer]);

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
        if (t && t.status == "ABIERTO") {
            navigate(`/torneo/${t.id}`);
        } else if (t && t.status == "CANCELADO") {
            navigate(`/torneo-cancelado/${t.id}`);
        } else if (t && t.status == "FINALIZADO") {
            navigate(`/torneo-finalizado/${t.id}`);
        }
    }, [t, navigate]);

    // Log fixtures when they load
    useEffect(() => {
        if (fixturesData) {
            console.log("Fixtures Eliminatoria:", fixturesData);
        }
    }, [fixturesData]);

    // Loading state
    if (loading || !t) {
        return (
            <div className="min-h-screen grid place-items-center text-purple-300 bg-surface-dark">
                <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen grid place-items-center text-rose-300 bg-surface-dark">
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

    const getEstadoBadge = () => {
        return <Badge className="bg-red-600/20 text-red-300 border-red-600/50 animate-pulse">● Iniciado</Badge>;
    };

    return (
        <div className="min-h-screen bg-surface-dark pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Card */}
                        <div className="bg-gradient-to-br from-purple-900/40 via-purple-800/20 to-surface-dark/20 border border-purple-700/30 rounded-2xl p-8">
                            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                        <Trophy className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-purple-400 text-sm">{t.discipline?.name || "Torneo"}</p>

                                        </div>
                                        <h1 className="text-white text-3xl">{t.name}</h1>
                                    </div>
                                </div>

                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-purple-400" />
                                        <p className="text-gray-500 text-sm">Inicio</p>
                                    </div>
                                    <p className="text-white text-sm">{formatDate(t.startAt)}</p>
                                </div>

                                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Play className="w-4 h-4 text-purple-400" />
                                        <p className="text-gray-500 text-sm">Formato</p>
                                    </div>
                                    <p className="text-white text-sm truncate">{t.format?.name || "Formato"}</p>
                                </div>

                                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        <p className="text-gray-500 text-sm">Participantes</p>
                                    </div>
                                    <p className="text-white text-sm">{t.teamsInscribed} / {t.maxParticipantsPerTournament}</p>
                                </div>

                                <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="w-4 h-4 text-purple-400" />
                                        <p className="text-gray-500 text-sm">Premio</p>
                                    </div>
                                    <p className="text-white text-sm">{t.prize}</p>
                                </div>
                            </div>

                        </div>

                        {/* Organizer Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-lg shadow-purple-500/20">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-white/20">
                                    <AvatarFallback className="bg-white/10 text-white text-lg md:text-xl">
                                        {organizerData?.name?.charAt(0).toUpperCase() || "O"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-white/80 text-sm">Organizado por</p>
                                    <h3 className="text-white">{organizerData ? `${organizerData.name} ${organizerData.lastName}` : "Cargando..."}</h3>
                                    {organizerData?.email && (
                                        <p className="text-white/70 text-sm mt-1">{organizerData.email}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < 4
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-white/30"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-white/80 text-sm ml-1">4/5</span>
                                    </div>
                                </div>
                                <Button
                                    className="bg-white/10 hover:bg-white/20 border-0"
                                >
                                    <Phone className="w-5 h-5 text-white" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Tabs */}
                        <Tabs defaultValue="competicion" className="w-full">
                            <TabsList className="bg-surface text-gray-400 border border-purple-800/20 inline-flex w-full sm:w-auto rounded-full p-1">
                                <TabsTrigger
                                    value="competicion"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm"
                                >
                                    <Play className="w-4 h-4" />
                                    <span className="hidden sm:inline">Competicion</span>
                                    <span className="sm:hidden">Comp.</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="participantes"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden sm:inline">Participantes</span>
                                    <span className="sm:hidden">Part.</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="detalles"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm"
                                >
                                    <Award className="w-4 h-4" />
                                    Detalles
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reglas"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm"
                                >
                                    <Shield className="w-4 h-4" />
                                    Reglas
                                </TabsTrigger>
                            </TabsList>

                            {/* Competición Tab */}
                            <TabsContent value="competicion" className="mt-6 space-y-6">
                                {/* Liga - Mostrar si el torneo genera fixture */}
                                {formatoEnUso === "Liga" && (
                                    <>
                                    <div className="space-y-6 bg-surface rounded-2xl">
                                        <TablaPosiciones posiciones={transformStandingsToTable(standingsData)} /> 
                                    </div>

                                    <div className="space-y-6 bg-surface rounded-2xl">
                                    <FixtureLiga jornadas={transformFixturesToLeague(fixturesData)} />
                                    </div>
                                    </>
                                )}

                                {/* Eliminatoria */}
                                {formatoEnUso === "Eliminatorio" && (
                                    <div className="overflow-x-auto bg-surface rounded-2xl">
                                        <div>
                                            <BracketEliminatoria etapas={transformFixturesToBracket(fixturesData)} />
                                        </div>
                                    </div>
                                )}

                                {/* Carrera / Battle Royale */}
                                {(formatoEnUso === "Carrera" || formatoEnUso === "Battle Royale") && (
                                    <div className="overflow-x-auto bg-surface rounded-2xl">
                                        <div>
                                            <RankingCarrera competidores={MOCK_PARTICIPANTES.map(p => ({ posicion: p.posicion || 0, nombre: p.nombre }))} />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Participantes Tab */}
                            <TabsContent value="participantes" className="mt-6">
                                <div className="overflow-x-auto bg-surface rounded-2xl">
                                    <div>
                                        <ListaParticipantes participantes={MOCK_PARTICIPANTES} mostrarPosicion={formatoEnUso !== "Eliminatorio"} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Detalles Tab */}
                            <TabsContent value="detalles" className="mt-6 ">
                                <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-400" />
                                        Descripción del Torneo
                                    </h3>
                                    {t.detalles ? (
                                        <p className="text-gray-300 leading-relaxed mb-6">{t.detalles}</p>
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed mb-6 italic">No hay detalles</p>
                                    )}

                                    <Separator className="my-6 bg-gray-800" />

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Formato</p>
                                            <p className="text-white capitalize">{t.format?.name || "Formato"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Disciplina</p>
                                            <p className="text-white">{t.discipline?.name || "No especificada"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Inicio</p>
                                            <p className="text-white flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-purple-400" />
                                                {formatDate(t.startAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm mb-1">Fin</p>
                                            <p className="text-white">
                                                {formatDate(t.endAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Reglas Tab */}
                            <TabsContent value="reglas" className="mt-6">
                                <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                        Reglas del Torneo
                                    </h3>
                                    <p className="text-gray-400">Reglas del torneo no disponibles.</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky top-24 space-y-4">
                            {/* Tournament Info Card */}
                            <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                <h3 className="text-white mb-4">Información del Torneo</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Estado</span>
                                        {getEstadoBadge()}
                                    </div>

                                    <Separator className="bg-gray-800" />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Inscripción</span>
                                            <span className="text-white">{formatCurrency(t.registrationCost || 0)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Premio Total</span>
                                            <span className="text-green-400">{t.prize}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Participantes</span>
                                            <span className="text-white">{t.teamsInscribed}/{t.maxParticipantsPerTournament}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Formato</span>
                                            <span className="text-white capitalize">{t.format?.name || "Formato"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-2xl p-6">
                                <h4 className="text-white mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-400" />
                                    Estadísticas Rápidas
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {formatoEnUso === "Liga" && (
                                        <>
                                            {(() => {
                                                const stats = calculateLeagueStats(fixturesData, standingsData);
                                                return (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Partidos Jugados</span>
                                                            <span className="text-white">{stats.finishedMatches}/{stats.totalMatches}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Jornada Actual</span>
                                                            <span className="text-white">{stats.currentRound} de {stats.totalRounds}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Líder</span>
                                                            <span className="text-white">{stats.leader}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Goles Totales</span>
                                                            <span className="text-white">{stats.totalGoals}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Promedio Goles/Partido</span>
                                                            <span className="text-white">{stats.averageGoals}</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}
                                    {formatoEnUso === "Eliminatorio" && (
                                        <>
                                            {(() => {
                                                const stats = calculateEliminationStats(fixturesData);
                                                return (
                                                    <>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Partidos Jugados</span>
                                                            <span className="text-white">{stats.finishedMatches}/{stats.totalMatches}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Ronda Actual</span>
                                                            <span className="text-white">{stats.currentRound}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Goles Totales</span>
                                                            <span className="text-white">{stats.totalGoals}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Promedio Goles/Partido</span>
                                                            <span className="text-white">{stats.averageGoals}</span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}