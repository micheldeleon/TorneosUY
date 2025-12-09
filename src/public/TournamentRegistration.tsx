import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    ArrowLeft, Users, Shield, UserPlus, Trash2, Save, Trophy, AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Separator } from "../components/ui/Separator";
import { Badge } from "../components/ui/Badge";
import { toast } from "sonner";
import { getTournamentById, getUserDetailsById } from "../services/api.service";
import { useApi } from "../hooks/useApi";
import type { TournamentDetails, UserDetails } from "../models";

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
    participantes: z.array(participanteSchema).min(1),
});

type InscripcionFormData = z.infer<typeof inscripcionSchema>; //Mover esto a un archivo 

export function TournamentRegistration() {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    const { data: organizerData, fetch: fetchOrganizer } = useApi<UserDetails, number>(getUserDetailsById);

    useEffect(() => {
        if (torneo?.organizerId) {
            fetchOrganizer(torneo.organizerId);
        }
    }, [torneo?.organizerId, fetchOrganizer]);

    const user = organizerData

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

    const onSubmit = async (data: InscripcionFormData) => {
        setIsSubmitting(true);

        // Validar cantidad mínima (sin contar al usuario logueado)
        const totalParticipantes = data.participantes.length + 1; // +1 por el usuario logueado
        if (totalParticipantes < torneo?.minParticipantsPerTeam!) {
            toast.error(`El equipo debe tener al menos ${torneo?.minParticipantsPerTeam} participantes`);
            setIsSubmitting(false);
            return;
        }

        toast.success("¡Inscripción exitosa! Tu equipo ha sido registrado.");

        setTimeout(() => {
            navigate("/perfil");
        }, 1500);

        setIsSubmitting(false);
    };

    const puedeAgregarMas = fields.length < maxAdicionales;
    const totalActual = fields.length + 1; // +1 por el usuario logueado

    return (
        <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20 px-4">
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
                                    <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/50">
                                        {torneo?.format.name}
                                    </Badge>
                                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/50">
                                        {torneo?.registrationCost === 0 ? "Gratis" : `Costo inscripcion: $${torneo?.registrationCost}`}
                                    </Badge>
                                    <Badge className="bg-green-600/20 text-green-300 border-green-600/50">
                                        Premio: ${torneo?.prize}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Requirements Alert */}
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
                </div>

                {/* Formulario */}
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
                            <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-600/50">
                                Capitán
                            </Badge>
                        </div>

                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Nombre Completo</p>
                                    <p className="text-white">{user?.name}</p>
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
                            disabled={isSubmitting || totalActual < torneo?.minParticipantsPerTeam!}
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
            </div>
        </div>
    );
}
