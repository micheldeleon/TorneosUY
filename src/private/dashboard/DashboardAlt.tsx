import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Trophy, Calendar, Users, Award, Edit, Plus,
    Target, ChevronRight, Settings, X, Save, User, Mail, Phone, AlertTriangle,
    Gem,
    ShieldPlusIcon,
    SettingsIcon,
    Filter,
    ArrowUpDown
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar, AvatarFallback } from "../../components/ui/Avatar";
import { Progress } from "../../components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Separator } from "../../components/ui/Separator";
import { getUsersByIdAndEmail, requestOrganizerPermission, updateUserDetails, getUserOrganizedTournaments, getUserParticipatingTournaments } from "../../services/api.service";
import type { UserDetails, TournamentDetails, ApiResponse } from "../../models";
import { useApi } from "../../hooks/useApi";
import { useIsOrganizer } from "../../hooks/useIsOrganizer";
import type { UserFind } from "../../models/userFind.model";
import { Skeleton } from "../../components/ui/Skeleton";
import { schema as detailsSchema, type FormValueDetails } from "../../components/ui/DetailsUserForm/details.form.model";

export default function DashboardAlt() {
    const navigate = useNavigate();
    const isOrganizer = useIsOrganizer();
    const { fetch, data, error, loading } = useApi<UserDetails, UserFind>(getUsersByIdAndEmail);
    const {fetch: fetchRequestOrganizerPermission} = useApi<ApiResponse, number>(requestOrganizerPermission);
    const { fetch: fetchOrganizedTournaments, data: organizedTournaments, loading: loadingOrganized } = useApi<TournamentDetails[], { id: number; email: string }>(getUserOrganizedTournaments);
    const { fetch: fetchParticipatingTournaments, data: participatingTournaments, loading: loadingParticipating } = useApi<TournamentDetails[], { id: number; email: string }>(getUserParticipatingTournaments);
    const [showEditModal, setShowEditModal] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [disciplineFilterActive, setDisciplineFilterActive] = useState<string>("all");
    const [disciplineFilterFinished, setDisciplineFilterFinished] = useState<string>("all");
    const [disciplineFilterOrganizedActive, setDisciplineFilterOrganizedActive] = useState<string>("all");
    const [disciplineFilterOrganizedFinished, setDisciplineFilterOrganizedFinished] = useState<string>("all");
    const [sortOrderActive, setSortOrderActive] = useState<"asc" | "desc">("desc");
    const [sortOrderFinished, setSortOrderFinished] = useState<"asc" | "desc">("desc");
    const [sortOrderOrganizedActive, setSortOrderOrganizedActive] = useState<"asc" | "desc">("desc");
    const [sortOrderOrganizedFinished, setSortOrderOrganizedFinished] = useState<"asc" | "desc">("desc");

    const toDateInputValue = (isoString: string) => {
        if (!isoString) return "";
        return isoString.split("T")[0];
    };

    // Verificar si faltan campos necesarios
    const isProfileIncomplete = useMemo(() => {
        if (!data) return true;
        const requiredFields = [
            data.name,
            data.lastName,
            data.email,
            data.dateOfBirth,
            data.nationalId,
            data.phoneNumber,
        ];
        return requiredFields.some((field) => !field || field.toString().trim() === "");
    }, [data]);

    // Formatear fecha para mostrar en el perfil en formato DD/MM/YYYY
    const formatDisplayDate = (isoString?: string | null) => {
        if (!isoString) return "No especificado";
        // Preferimos usar la parte fecha si viene en ISO (YYYY-MM-DD...)
        const datePart = isoString.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
        }

        // Fallback: intentar parsear con Date
        try {
            const d = new Date(isoString);
            if (!isNaN(d.getTime())) {
                const dd = String(d.getDate()).padStart(2, "0");
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const yyyy = d.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            }
        } catch (e) {
            // ignore
        }

        // Si todo falla, devolver la cadena original
        return isoString;
    };

    const displayDate = useMemo(() => formatDisplayDate(data?.dateOfBirth ?? null), [data?.dateOfBirth]);

    const defaults: FormValueDetails | null = useMemo(() => {
        if (!data) return null;
        return {
            name: data.name ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            dateOfBirth: toDateInputValue(data.dateOfBirth) ?? "",
            nationalId: data.nationalId ?? "",
            phoneNumber: data.phoneNumber ?? "",
            address: data.address ?? "",
            departmentId: data.departmentId,
        };
    }, [data]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValueDetails>({
        resolver: zodResolver(detailsSchema),
        defaultValues: defaults ?? undefined,
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    useEffect(() => {
        if (defaults) reset(defaults);
    }, [defaults, reset]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        try {
            const user: UserFind = JSON.parse(storedUser);
            fetch(user);
            // Cargar torneos organizados y participando
            fetchOrganizedTournaments({ id: user.id, email: user.email });
            fetchParticipatingTournaments({ id: user.id, email: user.email });
        } catch (e) {
            console.error("JSON inválido en localStorage.user", e);
            navigate("/login");
        }
    }, []);

    const requestOrganizerPermissionHandler = async () => {
        if (!data?.id) {
            alert("El ID del usuario no está disponible");
            return;
        }
        try {
            fetchRequestOrganizerPermission(data.id);
            if (data._status == 200) {
                alert("Solicitud de permiso de organizador enviada con éxito."); // Falta validar si el usuario ya tiene el permiso
            }
        } catch (error: any) {
            console.error("Error al solicitar permiso de organizador:", error);
            alert("Error al solicitar permiso de organizador: " + (error?.response?.data || "Error inesperado"));
        }
    };


    const onSubmit: SubmitHandler<FormValueDetails> = async (values) => {
        setServerError(null);
        setIsSubmitting(true);

        try {
            if (!data?.id) {
                setServerError("El ID del usuario no está disponible");
                setIsSubmitting(false);
                return;
            }

            const userToUpdate = { ...values, id: data.id };
            const { call } = updateUserDetails(userToUpdate);

            await call;

            console.log("Perfil actualizado:", userToUpdate);
            setShowEditModal(false);
            // Refrescar datos del usuario
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user: UserFind = JSON.parse(storedUser);
                fetch(user);
            }
        } catch (error: any) {
            console.error("Error al actualizar perfil:", error);

            if (error?.response?.data) {
                setServerError(error.response.data);
            } else {
                setServerError("Ocurrió un error inesperado al guardar los cambios");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formatear fecha para mostrar
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Obtener estado badge
    const getEstadoBadge = (status: string) => {
        switch (status) {
            case "ABIERTO":
                return { text: "Abierto", className: "bg-green-600/20 text-green-300 border-green-600/50" };
            case "INICIADO":
                return { text: "En Vivo", className: "bg-red-600/20 text-red-300 border-red-600/50 animate-pulse" };
            case "FINALIZADO":
                return { text: "Finalizado", className: "bg-gray-600/20 text-gray-300 border-gray-600/50" };
            case "CANCELADO":
                return { text: "Cancelado", className: "bg-orange-600/20 text-orange-300 border-orange-600/50" };
            default:
                return { text: status, className: "bg-purple-600/20 text-purple-300 border-purple-600/50" };
        }
    };

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    // Filtrar y dividir torneos organizados
    const organizedActiveTournaments = useMemo(() => {
        if (!organizedTournaments) return [];
        return organizedTournaments.filter(
            t => t.status === "ABIERTO" || t.status === "INICIADO"
        );
    }, [organizedTournaments]);

    const organizedFinishedTournaments = useMemo(() => {
        if (!organizedTournaments) return [];
        return organizedTournaments.filter(
            t => t.status === "FINALIZADO" || t.status === "CANCELADO"
        );
    }, [organizedTournaments]);

    // Aplicar filtro y orden a torneos organizados activos
    const filteredOrganizedActiveTournaments = useMemo(() => {
        let filtered = organizedActiveTournaments;
        if (disciplineFilterOrganizedActive !== "all") {
            filtered = filtered.filter(
                t => t.discipline?.name === disciplineFilterOrganizedActive
            );
        }
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.startAt).getTime();
            const dateB = new Date(b.startAt).getTime();
            return sortOrderOrganizedActive === "asc" ? dateA - dateB : dateB - dateA;
        });
    }, [organizedActiveTournaments, disciplineFilterOrganizedActive, sortOrderOrganizedActive]);

    // Aplicar filtro y orden a torneos organizados terminados
    const filteredOrganizedFinishedTournaments = useMemo(() => {
        let filtered = organizedFinishedTournaments;
        if (disciplineFilterOrganizedFinished !== "all") {
            filtered = filtered.filter(
                t => t.discipline?.name === disciplineFilterOrganizedFinished
            );
        }
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.startAt).getTime();
            const dateB = new Date(b.startAt).getTime();
            return sortOrderOrganizedFinished === "asc" ? dateA - dateB : dateB - dateA;
        });
    }, [organizedFinishedTournaments, disciplineFilterOrganizedFinished, sortOrderOrganizedFinished]);

    // Obtener lista única de disciplinas de torneos organizados activos
    const organizedActiveDisciplines = useMemo(() => {
        const disciplines = new Set<string>();
        organizedActiveTournaments.forEach(t => {
            if (t.discipline?.name) disciplines.add(t.discipline.name);
        });
        return Array.from(disciplines).sort();
    }, [organizedActiveTournaments]);

    // Obtener lista única de disciplinas de torneos organizados terminados
    const organizedFinishedDisciplines = useMemo(() => {
        const disciplines = new Set<string>();
        organizedFinishedTournaments.forEach(t => {
            if (t.discipline?.name) disciplines.add(t.discipline.name);
        });
        return Array.from(disciplines).sort();
    }, [organizedFinishedTournaments]);

    // Filtrar y dividir torneos participando
    const activeTournaments = useMemo(() => {
        if (!participatingTournaments) return [];
        return participatingTournaments.filter(
            t => t.status === "ABIERTO" || t.status === "INICIADO"
        );
    }, [participatingTournaments]);

    const finishedTournaments = useMemo(() => {
        if (!participatingTournaments) return [];
        return participatingTournaments.filter(
            t => t.status === "FINALIZADO" || t.status === "CANCELADO"
        );
    }, [participatingTournaments]);

    // Aplicar filtro de disciplina a torneos activos
    const filteredActiveTournaments = useMemo(() => {
        let filtered = activeTournaments;
        if (disciplineFilterActive !== "all") {
            filtered = filtered.filter(
                t => t.discipline?.name === disciplineFilterActive
            );
        }
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.startAt).getTime();
            const dateB = new Date(b.startAt).getTime();
            return sortOrderActive === "asc" ? dateA - dateB : dateB - dateA;
        });
    }, [activeTournaments, disciplineFilterActive, sortOrderActive]);

    // Aplicar filtro de disciplina a torneos terminados
    const filteredFinishedTournaments = useMemo(() => {
        let filtered = finishedTournaments;
        if (disciplineFilterFinished !== "all") {
            filtered = filtered.filter(
                t => t.discipline?.name === disciplineFilterFinished
            );
        }
        return [...filtered].sort((a, b) => {
            const dateA = new Date(a.startAt).getTime();
            const dateB = new Date(b.startAt).getTime();
            return sortOrderFinished === "asc" ? dateA - dateB : dateB - dateA;
        });
    }, [finishedTournaments, disciplineFilterFinished, sortOrderFinished]);

    // Obtener lista única de disciplinas de torneos activos
    const activeDisciplines = useMemo(() => {
        const disciplines = new Set<string>();
        activeTournaments.forEach(t => {
            if (t.discipline?.name) disciplines.add(t.discipline.name);
        });
        return Array.from(disciplines).sort();
    }, [activeTournaments]);

    // Obtener lista única de disciplinas de torneos terminados
    const finishedDisciplines = useMemo(() => {
        const disciplines = new Set<string>();
        finishedTournaments.forEach(t => {
            if (t.discipline?.name) disciplines.add(t.discipline.name);
        });
        return Array.from(disciplines).sort();
    }, [finishedTournaments]);

    return (
        <div className="min-h-screen bg-surface-dark pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {error && (
                    <div className="bg-rose-900/20 border border-rose-700/50 text-rose-300 rounded-xl p-4 mb-6">
                        Error al cargar datos: {String(error)}
                    </div>
                )}

                {/* Header Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Profile Card */}
                    <Card className="lg:col-span-2 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-[#2a2a2a] border-purple-700/30 p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                            {loading ? (
                                <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex-shrink-0" />
                            ) : (
                                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-purple-600/30 shadow-lg shadow-purple-500/20 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-lg sm:text-2xl">
                                        {getInitials(data?.name ?? "Usuario")}
                                    </AvatarFallback>
                                </Avatar>
                            )}

                            <div className="flex-1 min-w-0">
                                {loading ? (
                                    <>
                                        <Skeleton className="h-8 w-48 mb-2" />
                                        <Skeleton className="h-4 w-64 mb-4" />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-white text-2xl sm:text-3xl mb-2 break-words">{data?.name ?? "Usuario"}</h1>
                                        <p className="text-gray-400 mb-4 text-sm sm:text-base truncate">{data?.email}</p>
                                    </>
                                )}

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/50 px-2 py-1 text-xs sm:text-sm whitespace-nowrap">
                                        <Gem className="w-3 h-3 mr-1" />
                                        Membresia?
                                    </Badge>
                                    {isProfileIncomplete && (
                                        <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/50 px-2 py-1 text-xs sm:text-sm">
                                            <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                                            <span className="hidden sm:inline">Completa tu perfil para poder participar u organizar torneos</span>
                                            <span className="sm:hidden">Completa tu perfil</span>
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowEditModal(true)}
                                variant="outline"
                                size="sm"
                                className="border-purple-600 text-purple-300 hover:bg-purple-600/10 flex-shrink-0 mt-4 sm:mt-0 w-full sm:w-auto"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        </div>
                    </Card>

                    {/* Quick Action Card - Solo para organizadores */}
                    {isOrganizer ? (
                        <Card className="bg-gradient-to-br from-purple-600 to-purple-900 border-purple-700 p-6 sm:p-8 flex flex-col justify-center shadow-lg shadow-purple-500/20">
                            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-3 sm:mb-4 " />
                            <h3 className="text-white mb-2 text-base sm:text-lg">Crear Torneo</h3>
                            <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">
                                Organiza tu propio torneo y atrae competidores
                            </p>
                            <Button
                                onClick={() => navigate("/crearTorneo")}
                                className="w-full bg-white hover:bg-white/90 text-purple-900 text-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Torneo
                            </Button>
                        </Card>
                    ) : (
                        <Card className="bg-gradient-to-br from-purple-600 to-purple-900 border-purple-700 p-6 sm:p-8 flex flex-col justify-center shadow-lg shadow-purple-500/20">
                            <ShieldPlusIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-3 sm:mb-4 " />
                            <h3 className="text-white mb-2 text-base sm:text-lg">¿Quieres organizar?</h3>
                            <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">
                                Solicita permisos de organizador para crear tus propios torneos
                            </p>
                            <Button
                                onClick={requestOrganizerPermissionHandler}
                                className="w-full bg-white hover:bg-white/90 text-purple-900 text-sm"
                            >
                                <ShieldPlusIcon className="w-4 h-4 mr-2" />
                                Solicitar Permisos
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Main Content with Tabs */}
                <Tabs defaultValue={isOrganizer ? "organizadosActivos" : "activos"} className="w-full">
                    <div className="overflow-x-auto -mx-4 px-4 mb-6">
                        {/* Desktop: Barra única con separadores visuales */}
                        <div className="hidden lg:block">
                            <TabsList className="bg-[#2a2a2a] text-gray-400 border border-gray-800 inline-flex">
                                {isOrganizer && (
                                    <>
                                        <TabsTrigger
                                            value="organizadosActivos"
                                            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-sm"
                                        >
                                            <Trophy className="w-4 h-4 mr-2" />
                                            Organizados Activos
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="organizadosTerminados"
                                            className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-sm"
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Organizados Terminados
                                        </TabsTrigger>
                                        <div className="w-px bg-gray-700 mx-2 my-2"></div>
                                    </>
                                )}
                                <TabsTrigger
                                    value="activos"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-sm"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Torneos Activos
                                </TabsTrigger>
                                <TabsTrigger
                                    value="terminados"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-sm"
                                >
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Torneos Terminados
                                </TabsTrigger>
                                <div className="w-px bg-gray-700 mx-2 my-2"></div>
                                <TabsTrigger
                                    value="perfil"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-sm"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Mi Perfil
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Mobile: Dos filas */}
                        <div className="lg:hidden flex flex-col gap-2">
                            {isOrganizer && (
                                <TabsList className="bg-[#2a2a2a] text-gray-400 border border-gray-800 inline-flex w-full">
                                    <TabsTrigger
                                        value="organizadosActivos"
                                        className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm flex-1"
                                    >
                                        <Trophy className="w-4 h-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">Organizados Activos</span>
                                        <span className="sm:hidden">Org. Activos</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="organizadosTerminados"
                                        className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm flex-1"
                                    >
                                        <Settings className="w-4 h-4 mr-1 sm:mr-2" />
                                        <span className="hidden sm:inline">Organizados Terminados</span>
                                        <span className="sm:hidden">Org. Term.</span>
                                    </TabsTrigger>
                                </TabsList>
                            )}
                            
                            <TabsList className="bg-[#2a2a2a] text-gray-400 border border-gray-800 inline-flex w-full">
                                <TabsTrigger
                                    value="activos"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm flex-1"
                                >
                                    <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Torneos Activos</span>
                                    <span className="sm:hidden">Activos</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="terminados"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm flex-1"
                                >
                                    <Trophy className="w-4 h-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Torneos Terminados</span>
                                    <span className="sm:hidden">Terminados</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="perfil"
                                    className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300 whitespace-nowrap text-xs sm:text-sm flex-1"
                                >
                                    <User className="w-4 h-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">Mi Perfil</span>
                                    <span className="sm:hidden">Perfil</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    {/* Torneos Organizados Activos - Solo si es organizador */}
                    {isOrganizer && (
                        <TabsContent value="organizadosActivos">
                        {loadingOrganized ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-400 text-sm">Cargando torneos organizados activos...</p>
                                </div>
                            </div>
                        ) : organizedActiveTournaments && organizedActiveTournaments.length > 0 ? (
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">Torneos Organizados Activos</h2>
                                        <p className="text-gray-400 text-sm">Torneos que estás organizando actualmente</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                        {organizedActiveDisciplines.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <select
                                                    value={disciplineFilterOrganizedActive}
                                                    onChange={(e) => setDisciplineFilterOrganizedActive(e.target.value)}
                                                    className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-600 focus:outline-none w-full sm:w-auto"
                                                >
                                                    <option value="all">Todas las disciplinas</option>
                                                    {organizedActiveDisciplines.map((discipline) => (
                                                        <option key={discipline} value={discipline}>
                                                            {discipline}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <Button
                                            onClick={() => setSortOrderOrganizedActive(sortOrderOrganizedActive === "asc" ? "desc" : "asc")}
                                            variant="outline"
                                            size="sm"
                                            className="border-purple-600 text-purple-300 hover:bg-purple-600/10 flex items-center gap-2"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                            <span className="hidden sm:inline">{sortOrderOrganizedActive === "asc" ? "Más antiguos" : "Más recientes"}</span>
                                            <span className="sm:hidden">{sortOrderOrganizedActive === "asc" ? "Antiguos" : "Recientes"}</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {filteredOrganizedActiveTournaments.map((torneo) => {
                                    const estadoBadge = getEstadoBadge(torneo.status);
                                    return (
                                        <Card key={torneo.id} className="bg-[#2a2a2a] border-gray-800 overflow-hidden hover:border-purple-600/50 transition-all group">
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-white mb-1 group-hover:text-purple-300 transition-colors text-sm sm:text-base break-words">
                                                                {torneo.name}
                                                            </h3>
                                                            <p className="text-gray-500 text-xs sm:text-sm truncate">{torneo.discipline?.name || "Torneo"}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={`text-xs sm:text-sm whitespace-nowrap ${estadoBadge.className}`}>
                                                        {estadoBadge.text}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 sm:space-y-3 mb-4 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                        <span className="truncate">{formatDate(torneo.startAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                        <span>{torneo.teamsInscribed}/{torneo.maxParticipantsPerTournament} inscritos</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                        {torneo.prize ? (
                                                            <span className="truncate [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:ml-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: torneo.prize }} />
                                                        ) : (
                                                            <span className="truncate italic">Sin premio</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                                                        <span className="text-gray-400">Inscritos</span>
                                                        <span className="text-white">{torneo.teamsInscribed}/{torneo.maxParticipantsPerTournament}</span>
                                                    </div>
                                                    <Progress value={(torneo.teamsInscribed / torneo.maxParticipantsPerTournament) * 100} className="h-2" />
                                                </div>

                                                <Link to={`/manejar-torneo/${torneo.id}`}>
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white group-hover:shadow-lg group-hover:shadow-purple-500/30 text-sm"
                                                    >
                                                        Gestionar
                                                        <SettingsIcon className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                            </div>
                        ) : (
                            <Card className="bg-[#2a2a2a] border-gray-800 p-8 sm:p-12">
                                <div className="text-center">
                                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-white mb-2 text-sm sm:text-base">No tienes torneos organizados activos</h3>
                                    <p className="text-gray-400 mb-6 text-xs sm:text-sm">Crea tu primer torneo y empieza a organizar</p>
                                    <Button
                                        onClick={() => navigate("/crearTorneo")}
                                        className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear Torneo
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </TabsContent>
                    )}

                    {/* Torneos Organizados Terminados - Solo si es organizador */}
                    {isOrganizer && (
                        <TabsContent value="organizadosTerminados">
                        {loadingOrganized ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-400 text-sm">Cargando torneos organizados terminados...</p>
                                </div>
                            </div>
                        ) : organizedFinishedTournaments && organizedFinishedTournaments.length > 0 ? (
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">Torneos Organizados Terminados</h2>
                                        <p className="text-gray-400 text-sm">Historial de torneos que organizaste</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                        {organizedFinishedDisciplines.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <select
                                                    value={disciplineFilterOrganizedFinished}
                                                    onChange={(e) => setDisciplineFilterOrganizedFinished(e.target.value)}
                                                    className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-600 focus:outline-none w-full sm:w-auto"
                                                >
                                                    <option value="all">Todas las disciplinas</option>
                                                    {organizedFinishedDisciplines.map((discipline) => (
                                                        <option key={discipline} value={discipline}>
                                                            {discipline}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <Button
                                            onClick={() => setSortOrderOrganizedFinished(sortOrderOrganizedFinished === "asc" ? "desc" : "asc")}
                                            variant="outline"
                                            size="sm"
                                            className="border-purple-600 text-purple-300 hover:bg-purple-600/10 flex items-center gap-2"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                            <span className="hidden sm:inline">{sortOrderOrganizedFinished === "asc" ? "Más antiguos" : "Más recientes"}</span>
                                            <span className="sm:hidden">{sortOrderOrganizedFinished === "asc" ? "Antiguos" : "Recientes"}</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {filteredOrganizedFinishedTournaments.map((torneo) => {
                                    const estadoBadge = getEstadoBadge(torneo.status);
                                    return (
                                        <Card key={torneo.id} className="bg-[#2a2a2a] border-gray-800 overflow-hidden hover:border-purple-600/50 transition-all group opacity-80">
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-white mb-1 group-hover:text-purple-300 transition-colors text-sm sm:text-base break-words">
                                                                {torneo.name}
                                                            </h3>
                                                            <p className="text-gray-500 text-xs sm:text-sm truncate">{torneo.discipline?.name || "Torneo"}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={`text-xs sm:text-sm whitespace-nowrap ${estadoBadge.className}`}>
                                                        {estadoBadge.text}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 sm:space-y-3 mb-4 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                        <span className="truncate">{formatDate(torneo.startAt)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                        <span>{torneo.teamsInscribed}/{torneo.maxParticipantsPerTournament} inscritos</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                        {torneo.prize ? (
                                                            <span className="truncate [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:ml-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: torneo.prize }} />
                                                        ) : (
                                                            <span className="truncate italic">Sin premio</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <Link to={`/manejar-torneo/${torneo.id}`}>
                                                    <Button
                                                        className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white text-sm"
                                                    >
                                                        Gestionar
                                                        <SettingsIcon className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                            </div>
                        ) : (
                            <Card className="bg-[#2a2a2a] border-gray-800 p-8 sm:p-12">
                                <div className="text-center">
                                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-white mb-2 text-sm sm:text-base">No tienes torneos organizados terminados</h3>
                                    <p className="text-gray-400 text-xs sm:text-sm">Los torneos finalizados aparecerán aquí</p>
                                </div>
                            </Card>
                        )}
                    </TabsContent>
                    )}

                    {/* Torneos Activos */}
                    <TabsContent value="activos">
                        {loadingParticipating ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-400 text-sm">Cargando torneos activos...</p>
                                </div>
                            </div>
                        ) : activeTournaments && activeTournaments.length > 0 ? (
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">Torneos Activos</h2>
                                            <p className="text-gray-400 text-sm">Torneos en los que estás participando actualmente</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                        {activeDisciplines.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <select
                                                    value={disciplineFilterActive}
                                                    onChange={(e) => setDisciplineFilterActive(e.target.value)}
                                                    className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-600 focus:outline-none w-full sm:w-auto"
                                                >
                                                    <option value="all">Todas las disciplinas</option>
                                                    {activeDisciplines.map((discipline) => (
                                                        <option key={discipline} value={discipline}>
                                                            {discipline}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <Button
                                            onClick={() => setSortOrderActive(sortOrderActive === "asc" ? "desc" : "asc")}
                                            variant="outline"
                                            size="sm"
                                            className="border-purple-600 text-purple-300 hover:bg-purple-600/10 flex items-center gap-2"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                            <span className="hidden sm:inline">{sortOrderActive === "asc" ? "Más antiguos" : "Más recientes"}</span>
                                            <span className="sm:hidden">{sortOrderActive === "asc" ? "Antiguos" : "Recientes"}</span>
                                        </Button>
                                        </div>
                                    </div>

                                    {filteredActiveTournaments.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            {filteredActiveTournaments.map((torneo) => {
                                                const estadoBadge = getEstadoBadge(torneo.status);
                                                return (
                                                    <Card key={torneo.id} className="bg-[#2a2a2a] border-gray-800 overflow-hidden hover:border-purple-600/50 transition-all group">
                                                        <div className="p-4 sm:p-6">
                                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h3 className="text-white mb-1 group-hover:text-purple-300 transition-colors text-sm sm:text-base break-words">
                                                                            {torneo.name}
                                                                        </h3>
                                                                        <p className="text-gray-500 text-xs sm:text-sm truncate">{torneo.discipline?.name || "Torneo"}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge className={`text-xs sm:text-sm whitespace-nowrap ${estadoBadge.className}`}>
                                                                    {estadoBadge.text}
                                                                </Badge>
                                                            </div>

                                                            <div className="space-y-2 sm:space-y-3 mb-4 text-xs sm:text-sm">
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                                    <span className="truncate">{formatDate(torneo.startAt)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Target className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                                    <span>{torneo.format?.name || "Formato"}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                                    {torneo.prize ? (
                                                                        <span className="truncate [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:ml-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: torneo.prize }} />
                                                                    ) : (
                                                                        <span className="truncate italic">Sin premio</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                                                                    <span className="text-gray-400">Participantes</span>
                                                                    <span className="text-white">{torneo.teamsInscribed}/{torneo.maxParticipantsPerTournament}</span>
                                                                </div>
                                                                <Progress value={(torneo.teamsInscribed / torneo.maxParticipantsPerTournament) * 100} className="h-2" />
                                                            </div>

                                                            <Link to={`/torneo/${torneo.id}`}>
                                                                <Button
                                                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white group-hover:shadow-lg group-hover:shadow-purple-500/30 text-sm"
                                                                >
                                                                    Ver Detalles
                                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <Card className="bg-[#2a2a2a] border-gray-800 p-8">
                                            <div className="text-center">
                                                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                                <h3 className="text-white mb-1 text-sm">No hay torneos activos</h3>
                                                <p className="text-gray-400 text-xs">
                                                    {disciplineFilterActive !== "all" 
                                                        ? "No hay torneos activos en esta disciplina" 
                                                        : "No estás participando en torneos activos"}
                                                </p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                        ) : (
                            <Card className="bg-[#2a2a2a] border-gray-800 p-8 sm:p-12">
                                <div className="text-center">
                                    <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-white mb-2 text-sm sm:text-base">No estás participando en torneos activos</h3>
                                    <p className="text-gray-400 mb-6 text-xs sm:text-sm">Explora torneos disponibles y únete a la competencia</p>
                                    <Button
                                        onClick={() => navigate("/explorar-torneos")}
                                        className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-sm"
                                    >
                                        Explorar Torneos
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Torneos Terminados */}
                    <TabsContent value="terminados">
                        {loadingParticipating ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-400 text-sm">Cargando torneos terminados...</p>
                                </div>
                            </div>
                        ) : finishedTournaments && finishedTournaments.length > 0 ? (
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">Torneos Terminados</h2>
                                            <p className="text-gray-400 text-sm">Historial de torneos finalizados o cancelados</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                        {finishedDisciplines.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <Filter className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <select
                                                    value={disciplineFilterFinished}
                                                    onChange={(e) => setDisciplineFilterFinished(e.target.value)}
                                                    className="bg-[#2a2a2a] border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-purple-600 focus:outline-none w-full sm:w-auto"
                                                >
                                                    <option value="all">Todas las disciplinas</option>
                                                    {finishedDisciplines.map((discipline) => (
                                                        <option key={discipline} value={discipline}>
                                                            {discipline}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        <Button
                                            onClick={() => setSortOrderFinished(sortOrderFinished === "asc" ? "desc" : "asc")}
                                            variant="outline"
                                            size="sm"
                                            className="border-purple-600 text-purple-300 hover:bg-purple-600/10 flex items-center gap-2"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                            <span className="hidden sm:inline">{sortOrderFinished === "asc" ? "Más antiguos" : "Más recientes"}</span>
                                            <span className="sm:hidden">{sortOrderFinished === "asc" ? "Antiguos" : "Recientes"}</span>
                                        </Button>
                                        </div>
                                    </div>

                                    {filteredFinishedTournaments.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            {filteredFinishedTournaments.map((torneo) => {
                                                const estadoBadge = getEstadoBadge(torneo.status);
                                                return (
                                                    <Card key={torneo.id} className="bg-[#2a2a2a] border-gray-800 overflow-hidden hover:border-purple-600/50 transition-all group opacity-80">
                                                        <div className="p-4 sm:p-6">
                                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h3 className="text-white mb-1 group-hover:text-purple-300 transition-colors text-sm sm:text-base break-words">
                                                                            {torneo.name}
                                                                        </h3>
                                                                        <p className="text-gray-500 text-xs sm:text-sm truncate">{torneo.discipline?.name || "Torneo"}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge className={`text-xs sm:text-sm whitespace-nowrap ${estadoBadge.className}`}>
                                                                    {estadoBadge.text}
                                                                </Badge>
                                                            </div>

                                                            <div className="space-y-2 sm:space-y-3 mb-4 text-xs sm:text-sm">
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                                    <span className="truncate">{formatDate(torneo.startAt)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Target className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                                    <span>{torneo.format?.name || "Formato"}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-400">
                                                                    <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                                    {torneo.prize ? (
                                                                        <span className="truncate [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:ml-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: torneo.prize }} />
                                                                    ) : (
                                                                        <span className="truncate italic">Sin premio</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <Link to={`/torneo/${torneo.id}`}>
                                                                <Button
                                                                    className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white text-sm"
                                                                >
                                                                    Ver Detalles
                                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <Card className="bg-[#2a2a2a] border-gray-800 p-8">
                                            <div className="text-center">
                                                <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                                <h3 className="text-white mb-1 text-sm">No hay torneos terminados</h3>
                                                <p className="text-gray-400 text-xs">
                                                    {disciplineFilterFinished !== "all" 
                                                        ? "No hay torneos terminados en esta disciplina" 
                                                        : "No tienes torneos finalizados aún"}
                                                </p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                        ) : (
                            <Card className="bg-[#2a2a2a] border-gray-800 p-8 sm:p-12">
                                <div className="text-center">
                                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-white mb-2 text-sm sm:text-base">No tienes torneos terminados</h3>
                                    <p className="text-gray-400 mb-6 text-xs sm:text-sm">Cuando finalices torneos, aparecerán aquí</p>
                                </div>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Mi Perfil - Datos Personales */}
                    <TabsContent value="perfil">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Información Personal */}
                            <Card className="bg-[#2a2a2a] border-gray-800 p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 flex-wrap">
                                    <h3 className="text-white text-base sm:text-lg">Información Personal</h3>
                                    <Button
                                        onClick={() => setShowEditModal(true)}
                                        variant="outline"
                                        size="sm"
                                        className="border-purple-600 text-purple-300 hover:bg-purple-600/10 text-xs sm:text-sm"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                </div>

                                {loading ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-16 w-full" />
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <p className="text-gray-500 text-xs sm:text-sm">Nombre Completo</p>
                                            </div>
                                            <p className="text-white text-sm sm:text-base break-words">{data?.name || "No especificado"}</p>
                                        </div>

                                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                                            </div>
                                            <p className="text-white text-sm sm:text-base break-words">{data?.email || "No especificado"}</p>
                                        </div>

                                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <p className="text-gray-500 text-xs sm:text-sm">Teléfono</p>
                                            </div>
                                            <p className="text-white text-sm sm:text-base">{data?.phoneNumber || "No especificado"}</p>
                                        </div>

                                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <p className="text-gray-500 text-xs sm:text-sm">Fecha de Nacimiento</p>
                                            </div>
                                            <p className="text-white text-sm sm:text-base">{displayDate}</p>
                                        </div>

                                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                <p className="text-gray-500 text-xs sm:text-sm">Documento</p>
                                            </div>
                                            <p className="text-white text-sm sm:text-base">{data?.nationalId || "No especificado"}</p>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Preferencias y Seguridad */}
                            <Card className="bg-[#2a2a2a] border-gray-800 p-4 sm:p-6">
                                <h3 className="text-white mb-4 sm:mb-6 text-base sm:text-lg">Preferencias y Seguridad</h3>

                                <div className="space-y-3 sm:space-y-4">
                                    <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 border border-purple-700/30 rounded-xl p-3 sm:p-4">
                                        <h4 className="text-white mb-2 text-sm sm:text-base">Cambiar Contraseña</h4>
                                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                                            Mantén tu cuenta segura actualizando tu contraseña regularmente
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-purple-600 text-purple-300 hover:bg-purple-600/10 text-xs sm:text-sm"
                                        >
                                            Actualizar Contraseña
                                        </Button>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 border border-blue-700/30 rounded-xl p-3 sm:p-4">
                                        <h4 className="text-white mb-2 text-sm sm:text-base">Notificaciones</h4>
                                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                                            Configura cómo quieres recibir actualizaciones de torneos
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-blue-600 text-blue-300 hover:bg-blue-600/10 text-xs sm:text-sm"
                                        >
                                            Gestionar Notificaciones
                                        </Button>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 border border-green-700/30 rounded-xl p-3 sm:p-4">
                                        <h4 className="text-white mb-2 text-sm sm:text-base">Privacidad</h4>
                                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                                            Controla qué información es visible para otros usuarios
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-green-600 text-green-300 hover:bg-green-600/10 text-xs sm:text-sm"
                                        >
                                            Configurar Privacidad
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Edit Profile Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="bg-[#2a2a2a] border-purple-700/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
                                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                                    <h3 className="text-white text-xl sm:text-2xl">Editar Perfil</h3>
                                    <Button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-400 hover:text-white flex-shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <Separator className="mb-4 sm:mb-6 bg-gray-800" />

                                {/* Error Alert */}
                                {serverError && (
                                    <div className="mb-4 rounded bg-red-900 border-l-4 border-red-500 p-3 text-red-300 text-sm">
                                        {serverError}
                                    </div>
                                )}

                                <div className="space-y-4 sm:space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-800">
                                        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-purple-600/30">
                                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-lg sm:text-2xl">
                                                {defaults && getInitials(defaults.name || "Usuario")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="border-purple-600 text-purple-300 hover:bg-purple-600/10 text-xs sm:text-sm"
                                        >
                                            Cambiar Foto
                                        </Button>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Nombre */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-300 text-xs sm:text-sm">
                                                Nombre
                                            </Label>
                                            <Controller
                                                name="name"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="name"
                                                        {...field}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                        placeholder="Juan"
                                                    />
                                                )}
                                            />
                                            {errors.name && (
                                                <p className="text-xs text-red-400">{errors.name.message}</p>
                                            )}
                                        </div>

                                        {/* Apellido */}
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-gray-300 text-xs sm:text-sm">
                                                Apellido
                                            </Label>
                                            <Controller
                                                name="lastName"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="lastName"
                                                        {...field}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                        placeholder="Pérez"
                                                    />
                                                )}
                                            />
                                            {errors.lastName && (
                                                <p className="text-xs text-red-400">{errors.lastName.message}</p>
                                            )}
                                        </div>


                                        {/* Teléfono */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber" className="text-gray-300 text-xs sm:text-sm">
                                                Teléfono
                                            </Label>
                                            <Controller
                                                name="phoneNumber"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="phoneNumber"
                                                        {...field}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                        placeholder="+598 99 123 456"
                                                    />
                                                )}
                                            />
                                            {errors.phoneNumber && (
                                                <p className="text-xs text-red-400">{errors.phoneNumber.message}</p>
                                            )}
                                        </div>

                                        {/* Fecha de Nacimiento */}
                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth" className="text-gray-300 text-xs sm:text-sm">
                                                Fecha de Nacimiento
                                            </Label>
                                            <Controller
                                                name="dateOfBirth"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="dateOfBirth"
                                                        type="date"
                                                        {...field}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                    />
                                                )}
                                            />
                                            {errors.dateOfBirth && (
                                                <p className="text-xs text-red-400">{errors.dateOfBirth.message}</p>
                                            )}
                                        </div>

                                        {/* Documento */}
                                        <div className="space-y-2">
                                            <Label htmlFor="nationalId" className="text-gray-300 text-xs sm:text-sm">
                                                Documento de Identidad
                                            </Label>
                                            <Controller
                                                name="nationalId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="nationalId"
                                                        {...field}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                        placeholder="12345678"
                                                    />
                                                )}
                                            />
                                            {errors.nationalId && (
                                                <p className="text-xs text-red-400">{errors.nationalId.message}</p>
                                            )}
                                        </div>

                                        {/* Dirección */}
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="address" className="text-gray-300 text-xs sm:text-sm">
                                                Dirección
                                            </Label>
                                            <Controller
                                                name="address"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="address"
                                                        {...field}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                        placeholder="Calle y número"
                                                    />
                                                )}
                                            />
                                            {errors.address && (
                                                <p className="text-xs text-red-400">{errors.address.message}</p>
                                            )}
                                        </div>

                                        {/* Departamento */}
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="departmentId" className="text-gray-300 text-xs sm:text-sm">
                                                Departamento
                                            </Label>
                                            <Controller
                                                name="departmentId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="departmentId"
                                                        type="number"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                                        className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600 text-sm"
                                                        placeholder="ID del departamento"
                                                    />
                                                )}
                                            />
                                            {errors.departmentId && (
                                                <p className="text-xs text-red-400">{errors.departmentId.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-4 sm:my-6 bg-gray-800" />

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        variant="outline"
                                        className="sm:flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 text-sm"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="sm:flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-sm disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}