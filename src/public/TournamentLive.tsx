import { useParams, useNavigate } from "react-router-dom";
import {
    Trophy, Calendar, Users, ArrowLeft, Phone, Star,
    Award, Shield, Target, Play
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
import { getTournamentById, getUserDetailsById } from "../services/api.service";
import { RankingCarrera } from "../components/Tournament/RankingCarrera.tsx";

type FormatoTorneo = "Liga" | "Eliminatorio" | "Carrera" | "Battle Royale";

const MOCK_PARTICIPANTES = [
    { id: 1, nombre: "Equipaso FC", estado: "activo" as const, posicion: 1, equipo: "Grupo A" },
    { id: 2, nombre: "Los Tigres", estado: "activo" as const, posicion: 2, equipo: "Grupo A" },
    { id: 3, nombre: "Real Cracks", estado: "activo" as const, posicion: 3, equipo: "Grupo A" },
    { id: 4, nombre: "United Stars", estado: "activo" as const, posicion: 4, equipo: "Grupo A" },
    { id: 5, nombre: "Juventud FC", estado: "activo" as const, posicion: 5, equipo: "Grupo B" },
    { id: 6, nombre: "Pelota de Trapo", estado: "activo" as const, posicion: 6, equipo: "Grupo B" },
    { id: 7, nombre: "Los Campeones", estado: "activo" as const, posicion: 7, equipo: "Grupo B" },
    { id: 8, nombre: "Deportivo MVD", estado: "activo" as const, posicion: 8, equipo: "Grupo B" },
];

const MOCK_TABLA_LIGA = [
    { posicion: 1, equipo: "Equipaso FC", pj: 5, pg: 4, pe: 1, pp: 0, gf: 18, gc: 6, pts: 13 },
    { posicion: 2, equipo: "Los Tigres", pj: 5, pg: 3, pe: 2, pp: 0, gf: 14, gc: 7, pts: 11 },
    { posicion: 3, equipo: "Real Cracks", pj: 5, pg: 3, pe: 1, pp: 1, gf: 12, gc: 8, pts: 10 },
    { posicion: 4, equipo: "United Stars", pj: 5, pg: 2, pe: 2, pp: 1, gf: 10, gc: 9, pts: 8 },
    { posicion: 5, equipo: "Juventud FC", pj: 5, pg: 2, pe: 0, pp: 3, gf: 9, gc: 11, pts: 6 },
    { posicion: 6, equipo: "Los Campeones", pj: 5, pg: 1, pe: 2, pp: 2, gf: 8, gc: 12, pts: 5 },
    { posicion: 7, equipo: "Pelota de Trapo", pj: 5, pg: 1, pe: 0, pp: 4, gf: 6, gc: 15, pts: 3 },
    { posicion: 8, equipo: "Deportivo MVD", pj: 5, pg: 0, pe: 0, pp: 5, gf: 4, gc: 13, pts: 0 },
];

const MOCK_FIXTURE_LIGA = [
    {
        numero: 1,
        partidos: [
            { id: 1, equipoLocal: "Equipaso FC", equipoVisitante: "Los Tigres", resultadoLocal: 3, resultadoVisitante: 2, fecha: "10 Ene", hora: "14:00", estado: "jugado" as const },
            { id: 2, equipoLocal: "Real Cracks", equipoVisitante: "United Stars", resultadoLocal: 2, resultadoVisitante: 1, fecha: "10 Ene", hora: "15:00", estado: "jugado" as const },
        ]
    },
    {
        numero: 2,
        partidos: [
            { id: 3, equipoLocal: "Juventud FC", equipoVisitante: "Equipaso FC", resultadoLocal: 1, resultadoVisitante: 1, fecha: "17 Ene", hora: "14:00", estado: "jugado" as const },
            { id: 4, equipoLocal: "Los Campeones", equipoVisitante: "Los Tigres", resultadoLocal: 0, resultadoVisitante: 2, fecha: "17 Ene", hora: "15:00", estado: "pendiente" as const },
        ]
    },
    {
        numero: 3,
        partidos: [
            { id: 5, equipoLocal: "Equipaso FC", equipoVisitante: "Real Cracks", fecha: "24 Ene", hora: "14:00", estado: "pendiente" as const },
            { id: 6, equipoLocal: "United Stars", equipoVisitante: "Juventud FC", fecha: "24 Ene", hora: "15:00", estado: "pendiente" as const },
        ]
    },
];

const MOCK_BRACKET_ELIMINATORIA = [
    {
        nombre: "Cuartos de Final",
        duelos: [
            { id: 1, equipo1: "Equipaso FC", equipo2: "Los Campeones", resultado1: 4, resultado2: 1, ganador: "Equipaso FC", estado: "jugado" as const },
            { id: 2, equipo1: "Los Tigres", equipo2: "Juventud FC", resultado1: 3, resultado2: 2, ganador: "Los Tigres", estado: "jugado" as const },
            { id: 3, equipo1: "Real Cracks", equipo2: "United Stars", estado: "pendiente" as const },
            { id: 4, equipo1: "Pelota de Trapo", equipo2: "Deportivo MVD", estado: "pendiente" as const },
        ]
    },
    {
        nombre: "Semifinales",
        duelos: [
            { id: 5, equipo1: "Equipaso FC", equipo2: "Los Tigres", estado: "pendiente" as const },
            { id: 6, equipo1: "", equipo2: "", estado: "pendiente" as const },
        ]
    },
    {
        nombre: "Final",
        duelos: [
            { id: 7, equipo1: "", equipo2: "", estado: "pendiente" as const },
        ]
    },
    {
        nombre: "Campeón",
        duelos: [
            { id: 8, equipo1: "", esCampeon: true as const, estado: "pendiente" as const },
        ]
    },
];

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

    // Redirect to tournament page if the tournament is not in "INICIADO" state
    useEffect(() => {
        if (t && t.status && t.status !== "INICIADO") {
            navigate(`/torneo/${t.id}`);
        }
    }, [t, navigate]);

    // Loading state
    if (loading || !t) {
        return (
            <div className="min-h-screen grid place-items-center text-purple-300 bg-[#1a1a1a]">
                <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen grid place-items-center text-rose-300 bg-[#1a1a1a]">
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
        <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20 px-4">
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
                        <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-[#2a2a2a] border border-purple-700/30 rounded-2xl p-8">
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
                            <TabsList className="bg-[#2a2a2a] text-gray-400 border border-gray-800 inline-flex w-full sm:w-auto">
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
                                        <div className="overflow-x-auto">
                                            <div className="min-w-max">
                                                <TablaPosiciones posiciones={MOCK_TABLA_LIGA} />
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <div className="min-w-max">
                                                <FixtureLiga jornadas={MOCK_FIXTURE_LIGA} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Eliminatoria */}
                                {formatoEnUso === "Eliminatorio" && (
                                    <div className="overflow-x-auto">
                                        <div>
                                            <BracketEliminatoria etapas={MOCK_BRACKET_ELIMINATORIA} />
                                        </div>
                                    </div>
                                )}

                                {/* Carrera / Battle Royale */}
                                {(formatoEnUso === "Carrera" || formatoEnUso === "Battle Royale") && (
                                    <div className="overflow-x-auto">
                                        <div>
                                            <RankingCarrera competidores={MOCK_PARTICIPANTES.map(p => ({ posicion: p.posicion || 0, nombre: p.nombre }))} />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Participantes Tab */}
                            <TabsContent value="participantes" className="mt-6">
                                <div className="overflow-x-auto">
                                    <div>
                                        <ListaParticipantes participantes={MOCK_PARTICIPANTES} mostrarPosicion={formatoEnUso !== "Eliminatorio"} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Detalles Tab */}
                            <TabsContent value="detalles" className="mt-6">
                                <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-400" />
                                        Descripción del Torneo
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed mb-6">Detalles del torneo no disponibles</p>

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
                                <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
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
                            <div className="bg-[#2a2a2a] border border-gray-800 rounded-2xl p-6">
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
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Partidos Jugados</span>
                                                <span className="text-white">24</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Goles Totales</span>
                                                <span className="text-white">81</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Promedio Goles</span>
                                                <span className="text-white">3.4</span>
                                            </div>
                                        </>
                                    )}
                                    {formatoEnUso === "Eliminatorio" && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Ronda Actual</span>
                                                <span className="text-white">Cuartos de Final</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Equipos Restantes</span>
                                                <span className="text-white">8</span>
                                            </div>
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