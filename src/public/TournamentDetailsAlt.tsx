import { useParams, useNavigate } from "react-router-dom";
import {
    Trophy, Calendar, Users, ArrowLeft, Phone, Star,
    Award, Clock, Shield, Target, CheckCircle2,
    Play, FileText
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Checkbox } from "../components/ui/Checkbox";
import { Progress } from "../components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { Separator } from "../components/ui/Separator";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails, UserDetails } from "../models";
import { getTournamentById, getUserDetailsById } from "../services/api.service";



function formatCurrency(value: number) {
    return value === 0
        ? "Gratis"
        : new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 }).format(value);
}

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

export function TournamentDetailsAlt() {
    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const { id } = useParams();

    const memorizedGetTournamentById = useCallback(getTournamentById, []);
    const memorizedGetUserDetailsById = useCallback(getUserDetailsById, []);

    const {
        data,
        loading,
        error,
        fetch
    } = useApi<TournamentDetails, number>(memorizedGetTournamentById);

    const t = data;



    // Fetch tournament once per mount/param change (cleanup aborts in-flight request on unmount)
    useEffect(() => {
        if (!id) return;
        const cleanup = fetch(Number(id));
        return cleanup;
    }, [id]);

    useEffect(() => {
        if (t && t.status == "INICIADO") {
            navigate(`/torneo-iniciado/${t.id}`);
        } else if (t && t.status == "CANCELADO") {
            navigate(`/torneo-cancelado/${t.id}`);
        } else if (t && t.status == "FINALIZADO") {
            navigate(`/torneo-finalizado/${t.id}`);
        }
    }, [t, navigate]);

    // Fetch organizer details when organizerId is available
    const { data: organizerData, fetch: fetchOrganizer } = useApi<UserDetails, number>(memorizedGetUserDetailsById);

    useEffect(() => {
        if (t?.organizerId) {
            fetchOrganizer(t.organizerId);
        }
    }, [t?.organizerId, fetchOrganizer]);

    // Mostrar error SOLO si hay error
    if (error) {
        return (
            <div className="min-h-screen grid place-items-center text-purple-300 bg-surface-dark">
                <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Mostrar loader mientras carga o mientras t es falsy
    if (loading || !t) {
        return (
            <div className="min-h-screen grid place-items-center text-purple-300 bg-surface-dark">
                <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const progress = t.maxParticipantsPerTournament > 0 ? (t.teamsInscribed / t.maxParticipantsPerTournament) * 100 : 0;



    const organizerName = organizerData ? `${organizerData.name} ${organizerData.lastName}` : "Ignacio Barcelo";
    const organizerRating = 0;

    // Get organizer initials
    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };
    const spotsLeft = t.maxParticipantsPerTournament - t.teamsInscribed;

    const getIsPrivateBadge = () => {
        if (t.privateTournament) {
            return <Badge className="bg-red-600/20 text-red-300 border-red-600/50">Privado</Badge>;
        } else {
            return <Badge className="bg-green-600/20 text-green-300 border-green-600/50">Público</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-surface-dark pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/`)}
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
                                            <p className="text-purple-400 text-sm">{t.discipline.name}</p>
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
                                    <p className="text-white text-sm truncate">{t.format.name}</p>
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
                                    {t.prize ? (
                                        <div className="text-white text-sm [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: t.prize }} />
                                    ) : (
                                        <p className="text-gray-600 text-sm italic">Sin premio</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Organizer Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-lg shadow-purple-500/20">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-white/20">
                                    <AvatarFallback className="bg-white/10 text-white text-lg md:text-xl">
                                        {getInitials(organizerName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-white/80 text-sm">Organizado por</p>
                                    <h3 className="text-white">{organizerName}</h3>
                                    {organizerData?.email && (
                                        <p className="text-white/70 text-sm mt-1">{organizerData.email}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(organizerData?.reputation || organizerRating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-white/30"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-white/80 text-sm ml-1">{organizerData?.reputation || organizerRating}/5</span>
                                    </div>
                                </div>
                                <Button
                                    className="bg-white/10 hover:bg-white/20 border-0"
                                >
                                    <Phone className="w-5 h-5 text-white" />
                                </Button>
                            </div>
                        </div>

                        {/* Tabs Content */}
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="bg-surface text-gray-400 border border-purple-800/20 inline-flex w-full sm:w-auto rounded-full p-1 h-16 sm:h-auto">
                                <TabsTrigger value="details" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 flex-col sm:flex-row gap-0.5 sm:gap-2 py-1.5 sm:py-2">
                                    <Award className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">Detalles</span>
                                </TabsTrigger>
                                <TabsTrigger value="rules" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 flex-col sm:flex-row gap-0.5 sm:gap-2 py-1.5 sm:py-2">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">Reglas</span>
                                </TabsTrigger>
                                <TabsTrigger value="participantes" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 flex-col sm:flex-row gap-0.5 sm:gap-2 py-1.5 sm:py-2">
                                    <Users className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">Equipos</span>
                                </TabsTrigger>
                                <TabsTrigger value="info" className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 flex-col sm:flex-row gap-0.5 sm:gap-2 py-1.5 sm:py-2">
                                    <Target className="w-4 h-4" />
                                    <span className="text-xs sm:text-sm">Información</span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="mt-6">
                                <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                        Detalles del Torneo
                                    </h3>
                                    {t.detalles ? (
                                        <div className="text-gray-300 leading-relaxed mb-6 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: t.detalles }} />
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed mb-6 italic">No hay detalles</p>
                                    )}

                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-purple-400" />
                                        Fecha de finalización
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed mb-6">{formatDate(t.endAt)}</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="rules" className="mt-6">
                                <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                        Reglas del Torneo
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300">Regla 1</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300">Regla 2</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300">Regla 3</span>
                                        </li>
                                    </ul>
                                </div>
                            </TabsContent>

                            <TabsContent value="participantes" className="mt-6">
                                <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-purple-400" />
                                        Participantes Inscritos
                                    </h3>
                                    <div className="space-y-4">
                                        {t.teams && t.teams.length > 0 ? (
                                            t.teams.map((team: any, index: number) => (
                                                <div key={team.id} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                        <Avatar className="w-10 h-10 border-2 border-purple-600/30">
                                                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-sm">
                                                                {team.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <h4 className="text-white font-medium">{team.name}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Users className="w-3 h-3 text-gray-500" />
                                                                <p className="text-gray-500 text-sm">
                                                                    {team.participants.map((p: any) => p.fullName).join(', ')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                                                            {team.participants.length} {team.participants.length === 1 ? 'participante' : 'participantes'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p>No hay participantes inscritos aún</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="info" className="mt-6">
                                <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                    <h3 className="text-white mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-purple-400" />
                                        Información Adicional
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
                                            <p className="text-purple-300 mb-2">Equipos</p>
                                            <p className="text-white">Cant min. participantes por equipo: {t.minParticipantsPerTeam}</p>
                                            <p className="text-white">Cant max. participantes por equipo: {t.maxParticipantsPerTeam}</p>
                                        </div>
                                        <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
                                            <p className="text-purple-300 mb-2">Sistema de Premios</p>
                                            {t.prize ? (
                                                <div className="text-white"><strong>Premio total:</strong> <div className="[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: t.prize }} /></div>
                                            ) : (
                                                <p className="text-gray-600 italic">Sin premio</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Inscription Card */}
                            <div className="bg-surface border border-purple-800/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white">Estado del Torneo</h3>
                                    {getIsPrivateBadge()}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-400">Participantes</span>
                                            <span className="text-white">{t.teamsInscribed} / {t.maxParticipantsPerTournament}</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                        <p className="text-purple-400 text-sm mt-2">
                                            {spotsLeft} cupo{spotsLeft !== 1 ? 's' : ''} disponible{spotsLeft !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <Separator className="bg-gray-800" />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Costo de inscripción</span>
                                            <span className="text-white">{formatCurrency(t.registrationCost)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Fecha límite de inscripciones</span>
                                            <span className="text-white text-sm">{formatDate(t.registrationDeadline)}</span>
                                        </div>
                                    </div>

                                    <Separator className="bg-gray-800" />

                                    <div className="flex items-start gap-3 bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
                                        <Checkbox
                                            id="terms-alt"
                                            checked={acceptedTerms}
                                            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                                            className="mt-0.5 border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                        />
                                        <label
                                            htmlFor="terms-alt"
                                            className="text-sm text-gray-300 cursor-pointer leading-relaxed"
                                        >
                                            Acepto los <span className="text-purple-400">Términos y Condiciones</span> del torneo
                                        </label>
                                    </div>

                                    <Button
                                        disabled={!acceptedTerms || spotsLeft === 0}
                                        onClick={() => navigate(`/inscripcion-torneo/${t.id}`)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Inscribirme Ahora
                                    </Button>

                                    <p className="text-gray-500 text-xs text-center">
                                        Confirmación instantánea por email
                                    </p>
                                </div>
                            </div>

                            {/* Guarantee Card */}
                            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-2xl p-6">
                                <h4 className="text-white flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-purple-400" />
                                    Garantía TuTorneo
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}