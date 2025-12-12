import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Trophy, ArrowUp, ArrowDown, Save } from "lucide-react";
import { useState } from "react";
import type { Participante } from "../types/tournament";

interface AsignarPosicionesProps {
    participantes: Participante[];
    onSave: (participantesOrdenados: Participante[]) => void;
    readonly?: boolean;
}

export function AsignarPosiciones({ participantes, onSave, readonly = false }: AsignarPosicionesProps) {
    const [ordenados, setOrdenados] = useState<Participante[]>(
        [...participantes].sort((a, b) => (a.posicion || 999) - (b.posicion || 999))
    );

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    const moverArriba = (index: number) => {
        if (index === 0) return;
        const newOrdenados = [...ordenados];
        [newOrdenados[index], newOrdenados[index - 1]] = [newOrdenados[index - 1], newOrdenados[index]];
        setOrdenados(newOrdenados);
    };

    const moverAbajo = (index: number) => {
        if (index === ordenados.length - 1) return;
        const newOrdenados = [...ordenados];
        [newOrdenados[index], newOrdenados[index + 1]] = [newOrdenados[index + 1], newOrdenados[index]];
        setOrdenados(newOrdenados);
    };

    const handleGuardar = () => {
        const participantesConPosicion = ordenados.map((p, index) => ({
            ...p,
            posicion: index + 1,
        }));
        onSave(participantesConPosicion);
    };

    const getPosicionColor = (pos: number) => {
        if (pos === 1) return "from-yellow-600 to-yellow-800";
        if (pos === 2) return "from-gray-500 to-gray-700";
        if (pos === 3) return "from-orange-600 to-orange-800";
        return "from-purple-600 to-purple-800";
    };

    return (
        <Card className="bg-[#2a2a2a] border-gray-800">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-purple-400" />
                        {readonly ? "Posiciones Finales" : "Asignar Posiciones"}
                    </h3>
                    {!readonly && (
                        <Button
                            onClick={handleGuardar}
                            className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Posiciones
                        </Button>
                    )}
                </div>

                <div className="space-y-3">
                    {ordenados.map((participante, index) => (
                        <div
                            key={participante.id}
                            className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Posición */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${getPosicionColor(index + 1)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <span className="text-white text-xl">#{index + 1}</span>
                                </div>

                                {/* Avatar y Nombre */}
                                <Avatar className="w-10 h-10 border-2 border-purple-600/30">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-sm">
                                        {getInitials(participante.nombre)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <h4 className="text-white">{participante.nombre}</h4>
                                </div>

                                {/* Controles de movimiento */}
                                {!readonly && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => moverArriba(index)}
                                            disabled={index === 0}
                                            variant="outline"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-30"
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => moverAbajo(index)}
                                            disabled={index === ordenados.length - 1}
                                            variant="outline"
                                            className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-30"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {!readonly && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
                        <p className="text-blue-300 text-sm">
                            💡 Usa las flechas para ordenar a los participantes. El primero en la lista será el ganador.
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
