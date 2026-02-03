import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ArrowLeft, Users, Shield, UserPlus, Trash2, Save, Trophy, AlertCircle, Lock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Separator } from "../components/ui/Separator";
import { Badge } from "../components/ui/Badge";
import { toast } from "sonner";
import { getTournamentById, getUserDetailsById, registerTeam, registerRunnerToTournament } from "../services/api.service";
import { useApi } from "../hooks/useApi";
import type { ApiResponse, TournamentDetails, UserDetails, UserFind } from "../models";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/Dialog";

// Validación de CI uruguaya (8 dígitos con posible guión)
const ciSchema = z.string()
    .min(7, "CI debe tener al menos 7 dígitos")
    .max(9, "CI no puede tener más de 9 caracteres")
    .regex(/^[0-9]{1,8}[-]?[0-9]?$/, "Formato de CI inválido");

const participanteSchema = z.object({
    nombre: z.string().min(3, "Nombre debe tener al menos 3 caracteres"),
    ci: ciSchema,
});

const inscripcionSchema = z.object({
    nombreEquipo: z.string().min(3, "El nombre del equipo debe tener al menos 3 caracteres"),
    participantes: z.array(participanteSchema).min(0),
});

type InscripcionFormData = z.infer<typeof inscripcionSchema>; //Mover esto a un archivo 

export function TournamentRegistration() {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showRunnerModal, setShowRunnerModal] = useState(false);

    const { id } = useParams();

    const {
        data,
        fetch
    } = useApi<TournamentDetails, number>(getTournamentById);

    const torneo = data;

    useEffect(() => {
        if (id) {
            fetch(Number(id));
        }
    }, [id, fetch]);

    useEffect(() => {
        if (!id) return;
        const cleanup = fetch(Number(id));
        return cleanup;
    }, [id, fetch]);

    // Fetch organizer details when organizerId is available
    const { data: userData, fetch: fetchUser } = useApi<UserDetails, number>(getUserDetailsById);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        try {
            const user: UserFind = JSON.parse(storedUser);
            fetchUser(user.id!);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            navigate("/login");
        }
    }, [fetchUser]);

    const user = userData

    const { data: runnerRegisterData, error: runnerRegisterError, loading: runnerRegisterLoading, fetch: fetchRegisterRunner } = useApi<ApiResponse, any>(registerRunnerToTournament);

    // Verificar si es un torneo de carrera
    const isRaceFormat = torneo?.format?.name?.toLowerCase() === "carrera";

    // Verificar si el torneo es privado y requiere contraseña
    useEffect(() => {
        if (torneo && !torneo.privateTournament) {
            setIsUnlocked(true);
        }
    }, [torneo]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!torneo?.password) {
            toast.error("Error: No se encontró la contraseña del torneo");
            return;
        }
        
        if (passwordInput === torneo.password) {
            setIsUnlocked(true);
            setPasswordError("");
            toast.success("¡Acceso concedido!");
        } else {
            setPasswordError("Contraseña incorrecta");
            toast.error("Contraseña incorrecta");
        }
    };


    const minAdicionales = torneo
        ? Math.max(0, torneo.minParticipantsPerTeam - 1)
        : 0;

    const maxAdicionales = torneo
        ? torneo.maxParticipantsPerTeam - 1
        : 0;


    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<InscripcionFormData>({
        resolver: zodResolver(inscripcionSchema),
        defaultValues: {
            nombreEquipo: "",
            participantes: Array(minAdicionales).fill({ nombre: "", ci: "" }),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "participantes",
    });

    // Función para validar si el perfil del usuario está completo
    const isProfileComplete = (): boolean => {
        if (!user) return false;
        
        return !!(
            user.name &&
            user.lastName &&
            user.nationalId &&
            user.phoneNumber &&
            user.dateOfBirth
        );
    };

    const onSubmit = async (formData: InscripcionFormData) => {
        // Validar perfil completo antes de proceder
        if (!isProfileComplete()) {
            toast.error("Debes completar tu perfil antes de inscribirte. Por favor, ve a tu perfil y completa todos los campos requeridos.", {
                duration: 5000
            });
            return;
        }

        // Si es formato carrera, mostrar modal de confirmación
        if (isRaceFormat) {
            setShowRunnerModal(true);
            return;
        }

        try {
            setIsSubmitting(true);

            if (!user || !user.id) {
                toast.error("Error: no se encontró información del usuario.");
                return;
            }

            if (!id || !torneo) {
                toast.error("Error: no se encontró información del torneo.");
                return;
            }

            // Validar cantidad mínima TOTAL (capitán + formulario)
            const totalParticipantes = formData.participantes.length + 1; // +1 por el usuario logueado
            if (totalParticipantes < torneo.minParticipantsPerTeam) {
                toast.error(`El equipo debe tener al menos ${torneo.minParticipantsPerTeam} participantes.`);
                return;
            }

            // 🔥 Armar payload EXACTO para el backend
            const payload = {
                userId: user.id,
                teamName: formData.nombreEquipo,
                participants: [
                    // Capitán primero
                    {
                        fullName: user.name,
                        nationalId: user.nationalId,
                    },
                    // Luego los ingresados en el form
                    ...formData.participantes.map((p) => ({
                        fullName: p.nombre,
                        nationalId: p.ci
                    }))
                ]
            };

            // 🔥 Llamada real al backend
            const { call } = registerTeam({
                tournamentId: Number(id),
                data: payload
            });
            const response = await call;

            console.log("Respuesta de inscripción:", response?.data);

            if (response?.data?.message === "Equipo inscrito correctamente") {
                toast.success(response?.data?.message || "¡Inscripción exitosa! Tu equipo ha sido registrado.");
                
                setTimeout(() => {
                    navigate("/perfil");
                }, 600);

            } else {
                const msg = response?.data?.message || "No se pudo completar la inscripción.";
                toast.error(msg);
                return;
            }

        } catch (error: any) {
            console.error(error);
            const backendMessage =
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Error al inscribir el equipo.";
            toast.error(backendMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRunnerRegistration = () => {
        // Validar perfil completo antes de proceder
        if (!isProfileComplete()) {
            toast.error("Debes completar tu perfil antes de inscribirte. Por favor, ve a tu perfil y completa todos los campos requeridos.", {
                duration: 5000
            });
            setShowRunnerModal(false);
            setIsSubmitting(false);
            return;
        }

        try {
            setIsSubmitting(true);

            if (!id) {
                toast.error("Error: no se encontró información del torneo.");
                setIsSubmitting(false);
                return;
            }

            fetchRegisterRunner({
                tournamentId: Number(id),
                request: {} // El backend usa Authentication para obtener el usuario
            });

        } catch (error: any) {
            console.error(error);
            toast.error("Error al inscribirse a la carrera.");
            setIsSubmitting(false);
        }
    };

    // Efecto para manejar la respuesta de registro de corredor
    useEffect(() => {
        if (runnerRegisterData && !runnerRegisterLoading) {
            toast.success(runnerRegisterData.message || "Inscripción exitosa");
            setShowRunnerModal(false);
            setIsSubmitting(false);
            setTimeout(() => {
                navigate("/perfil");
            }, 600);
        }
        if (runnerRegisterError && !runnerRegisterLoading) {
            const backendMessage =
                (runnerRegisterError as any)?.response?.data?.message ||
                (runnerRegisterError as any)?.response?.data ||
                runnerRegisterError?.message ||
                "Error al inscribirse a la carrera.";
            toast.error(backendMessage);
            setIsSubmitting(false);
        }
    }, [runnerRegisterData, runnerRegisterError, runnerRegisterLoading, navigate]);


    const puedeAgregarMas = fields.length < maxAdicionales;
    const totalActual = fields.length + 1; // +1 por el usuario logueado

    return (
        <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20 px-4 relative" aria-busy={isSubmitting}>
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>

                    {/* Torneo Info Card */}
                    <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50 p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-white text-2xl mb-1">{torneo?.name}</h1>
                                <p className="text-gray-400 mb-3">Inscribe a tu equipo para participar</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-violet-500/10 text-violet-200 border border-violet-500/20">
                                        {torneo?.format.name}
                                    </Badge>
                                    <Badge className="bg-blue-500/10 text-blue-200 border border-blue-500/20">
                                        {torneo?.registrationCost === 0 ? "Gratis" : `Costo inscripcion: $${torneo?.registrationCost}`}
                                    </Badge>
                                    {torneo?.prize && (
                                        <Badge className="bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">
                                            <span>Premio: </span>
                                            <span className="[&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:ml-2 [&_strong]:font-bold [&_em]:italic [&_u]:underline" dangerouslySetInnerHTML={{ __html: torneo.prize }} />
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Requirements Alert - solo para equipos */}
                    {!isRaceFormat && (
                    <Card className="bg-blue-900/20 border-blue-700/30 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-blue-300 mb-1">
                                    <strong>Requisitos del equipo:</strong>
                                </p>
                                <p className="text-blue-300 text-sm">
                                    Mínimo <strong>{torneo?.minParticipantsPerTeam}</strong> participantes - Máximo <strong>{torneo?.maxParticipantsPerTeam}</strong> participantes
                                </p>
                                <p className="text-blue-400 text-xs mt-2">
                                    💡 Tú ya cuentas como participante, agrega entre {minAdicionales} y {maxAdicionales} miembros adicionales
                                </p>
                            </div>
                        </div>
                    </Card>
                    )}

                    {/* Alerta de perfil incompleto */}
                    {!isProfileComplete() && (
                        <Card className="bg-red-900/20 border-red-700/30 p-4 mt-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-300 mb-1">
                                        <strong>Perfil Incompleto</strong>
                                    </p>
                                    <p className="text-red-300 text-sm mb-2">
                                        Debes completar tu perfil antes de inscribirte a este torneo.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/perfil")}
                                        className="bg-red-600/20 border-red-600/50 text-red-300 hover:bg-red-600/30"
                                    >
                                        Ir a Mi Perfil
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Contenido del formulario con blur si no está desbloqueado */}
                <div className={`${torneo?.privateTournament && !isUnlocked ? 'blur-lg pointer-events-none select-none' : ''} transition-all duration-300`}>
                    {/* Formulario simplificado para carreras */}
                    {isRaceFormat ? (
                        <Card className="bg-[#2a2a2a] border-gray-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white text-xl">Inscripción Individual</h2>
                                    <p className="text-gray-400 text-sm">Confirma tu participación en esta carrera</p>
                                </div>
                            </div>

                            <Card className="bg-[#1a1a1a] border-gray-800 p-4 mb-6">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-400 text-sm">Nombre Completo</p>
                                        <p className="text-white font-medium">{user?.name} {user?.lastName}</p>
                                    </div>
                                    <Separator className="bg-gray-800" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Cédula de Identidad</p>
                                        <p className="text-white font-medium">{user?.nationalId}</p>
                                    </div>
                                    <Separator className="bg-gray-800" />
                                    <div>
                                        <p className="text-gray-400 text-sm">Email</p>
                                        <p className="text-white font-medium">{user?.email}</p>
                                    </div>
                                </div>
                            </Card>

                            <Button
                                type="button"
                                onClick={() => setShowRunnerModal(true)}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white h-12 text-base"
                                disabled={isSubmitting || !isProfileComplete()}
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Inscribirme a la Carrera
                            </Button>
                        </Card>
                    ) : (
                        /* Formulario normal para equipos */
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nombre del Equipo */}
                    <Card className="bg-[#2a2a2a] border-gray-800 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-white text-xl">Información del Equipo</h2>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nombreEquipo" className="text-gray-300">
                                Nombre del Equipo *
                            </Label>
                            <Input
                                id="nombreEquipo"
                                {...register("nombreEquipo")}
                                placeholder="Ej: Los Campeones FC"
                                className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                            />
                            {errors.nombreEquipo && (
                                <p className="text-rose-400 text-sm">{errors.nombreEquipo.message}</p>
                            )}
                        </div>
                    </Card>

                    {/* Usuario Logueado (Capitán) */}
                    <Card className="bg-[#2a2a2a] border-gray-800 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-white text-xl">Capitán del Equipo</h2>
                                <p className="text-gray-400 text-sm">Tu cuenta será el capitán automáticamente</p>
                            </div>
                            <Badge className="bg-amber-500/10 text-amber-200 border border-amber-500/20">
                                Capitán
                            </Badge>
                        </div>

                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Nombre Completo</p>
                                    <p className="text-white">{user?.name} {user?.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Cédula de Identidad</p>
                                    <p className="text-white">{user?.nationalId}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Participantes Adicionales */}
                    <Card className="bg-[#2a2a2a] border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white text-xl">Miembros del Equipo</h2>
                                    <p className="text-gray-400 text-sm">
                                        {totalActual} de {torneo?.maxParticipantsPerTeam} participantes
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={() => append({ nombre: "", ci: "" })}
                                disabled={!puedeAgregarMas}
                                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Agregar
                            </Button>
                        </div>

                        <Separator className="mb-6 bg-gray-800" />

                        {fields.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500">
                                    Agrega miembros a tu equipo
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    Mínimo {minAdicionales} miembros adicionales requeridos
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-white">
                                                Participante #{index + 2}
                                            </h3>
                                            <Button
                                                type="button"
                                                onClick={() => remove(index)}
                                                disabled={fields.length <= minAdicionales}
                                                variant="ghost"
                                                size="sm"
                                                className="text-rose-400 hover:text-rose-300 hover:bg-rose-600/10 disabled:opacity-30"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-gray-300">
                                                    Nombre Completo *
                                                </Label>
                                                <Input
                                                    {...register(`participantes.${index}.nombre`)}
                                                    placeholder="Nombre completo"
                                                    className="bg-[#0f0f0f] border-gray-700 text-white focus:border-purple-600"
                                                />
                                                {errors.participantes?.[index]?.nombre && (
                                                    <p className="text-rose-400 text-sm">
                                                        {errors.participantes[index]?.nombre?.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-gray-300">
                                                    Cédula de Identidad *
                                                </Label>
                                                <Input
                                                    {...register(`participantes.${index}.ci`)}
                                                    placeholder="5123123-0"
                                                    className="bg-[#0f0f0f] border-gray-700 text-white focus:border-purple-600"
                                                />
                                                {errors.participantes?.[index]?.ci && (
                                                    <p className="text-rose-400 text-sm">
                                                        {errors.participantes[index]?.ci?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progreso</span>
                                <span className={`${totalActual >= torneo?.minParticipantsPerTeam!
                                    ? "text-green-400"
                                    : "text-yellow-400"
                                    }`}>
                                    {totalActual} / {torneo?.minParticipantsPerTeam} mínimo
                                </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full transition-all ${totalActual >= torneo?.minParticipantsPerTeam!
                                        ? "bg-gradient-to-r from-green-600 to-green-800"
                                        : "bg-gradient-to-r from-yellow-600 to-yellow-800"
                                        }`}
                                    style={{
                                        width: `${Math.min((totalActual / torneo?.minParticipantsPerTeam!) * 100, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isProfileComplete() || totalActual < torneo?.minParticipantsPerTeam!}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>Procesando...</>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Inscribir Equipo
                                </>
                            )}
                        </Button>
                    </div>

                    {totalActual < torneo?.minParticipantsPerTeam! && (
                        <Card className="bg-yellow-900/20 border-yellow-700/30 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-yellow-300 text-sm">
                                    Necesitas agregar al menos {torneo?.minParticipantsPerTeam! - totalActual} participante(s) más para completar el mínimo requerido.
                                </p>
                            </div>
                        </Card>
                    )}
                </form>
                    )}
            </div>

            {/* Modal de confirmación para Runners */}
            <Dialog open={showRunnerModal} onOpenChange={setShowRunnerModal}>
                <DialogContent className="bg-[#2a2a2a] border-purple-700/50 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-purple-400" />
                            Confirmar Inscripción
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Verifica tus datos antes de confirmar tu inscripción
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 my-4">
                        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm">Nombre Completo</p>
                                    <p className="text-white font-medium">{user?.name}</p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div>
                                    <p className="text-gray-400 text-sm">Cédula de Identidad</p>
                                    <p className="text-white font-medium">{user?.nationalId}</p>
                                </div>
                                <Separator className="bg-gray-800" />
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-white font-medium">{user?.email}</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card className="bg-blue-900/20 border-blue-700/30 p-3">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-blue-300 text-sm">
                                    Asegúrate de que tus datos sean correctos antes de confirmar. Una vez registrado, deberás contactar al organizador para modificar tu inscripción.
                                </p>
                            </div>
                        </Card>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={() => setShowRunnerModal(false)}
                            variant="outline"
                            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleRunnerRegistration}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Confirmar Inscripción
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal de contraseña para torneos privados */}
            {torneo?.privateTournament && !isUnlocked && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4">
                    <Card className="bg-[#2a2a2a] border-purple-700/50 p-8 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-white text-2xl mb-2">Torneo Privado</h2>
                            <p className="text-gray-400">Este torneo requiere una contraseña para inscribirse</p>
                        </div>
                        
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">
                                    Contraseña del Torneo *
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => {
                                        setPasswordInput(e.target.value);
                                        setPasswordError("");
                                    }}
                                    placeholder="Ingresa la contraseña"
                                    className="bg-[#1a1a1a] border-gray-700 text-white focus:border-purple-600"
                                    autoFocus
                                />
                                {passwordError && (
                                    <p className="text-rose-400 text-sm flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {passwordError}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    variant="outline"
                                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                                >
                                    <Lock className="w-4 h-4 mr-2" />
                                    Desbloquear
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {isSubmitting && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center">
                    <div className="flex flex-col items-center gap-3 bg-[#1f1f1f] border border-gray-800 rounded-xl p-6 shadow-xl">
                        <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white">Registrando equipo...</p>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
