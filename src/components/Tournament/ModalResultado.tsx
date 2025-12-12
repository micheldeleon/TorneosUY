import { X, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Separator } from "../ui/Separator";
import { useState } from "react";

interface ModalResultadoProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (resultadoLocal: number, resultadoVisitante: number) => void;
    equipoLocal: string;
    equipoVisitante: string;
    resultadoActual?: {
        local: number;
        visitante: number;
    };
}

export function ModalResultado({
    isOpen,
    onClose,
    onSave,
    equipoLocal,
    equipoVisitante,
    resultadoActual,
}: ModalResultadoProps) {
    const [resultadoLocal, setResultadoLocal] = useState(resultadoActual?.local?.toString() || "");
    const [resultadoVisitante, setResultadoVisitante] = useState(resultadoActual?.visitante?.toString() || "");

    if (!isOpen) return null;

    const handleSave = () => {
        const local = parseInt(resultadoLocal);
        const visitante = parseInt(resultadoVisitante);

        if (isNaN(local) || isNaN(visitante) || local < 0 || visitante < 0) {
            alert("Por favor ingresa resultados válidos");
            return;
        }

        onSave(local, visitante);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-[#2a2a2a] border-purple-700/30 max-w-lg w-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white text-2xl">Establecer Resultado</h3>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <Separator className="mb-6 bg-gray-800" />

                    {/* Equipos */}
                    <div className="space-y-6">
                        {/* Equipo Local */}
                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                            <Label htmlFor="local" className="text-gray-300 mb-2 block">
                                {equipoLocal}
                            </Label>
                            <Input
                                id="local"
                                type="number"
                                min="0"
                                value={resultadoLocal}
                                onChange={(e) => setResultadoLocal(e.target.value)}
                                className="bg-[#0f0f0f] border-gray-700 text-white text-3xl text-center focus:border-purple-600 h-16"
                                placeholder="0"
                            />
                        </div>

                        {/* VS Divider */}
                        <div className="text-center">
                            <span className="text-gray-500 text-lg">VS</span>
                        </div>

                        {/* Equipo Visitante */}
                        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                            <Label htmlFor="visitante" className="text-gray-300 mb-2 block">
                                {equipoVisitante}
                            </Label>
                            <Input
                                id="visitante"
                                type="number"
                                min="0"
                                value={resultadoVisitante}
                                onChange={(e) => setResultadoVisitante(e.target.value)}
                                className="bg-[#0f0f0f] border-gray-700 text-white text-3xl text-center focus:border-purple-600 h-16"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <Separator className="my-6 bg-gray-800" />

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Resultado
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
