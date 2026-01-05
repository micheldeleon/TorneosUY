import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useState } from "react";

interface Partido {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  resultadoLocal?: number;
  resultadoVisitante?: number;
  fecha?: string;
  hora?: string;
  estado: "jugado" | "pendiente" | "en_vivo";
}

interface Jornada {
  numero: number;
  partidos: Partido[];
}

interface FixtureLigaProps {
  jornadas: Jornada[];
}

export function FixtureLiga({ jornadas }: FixtureLigaProps) {
  const [jornadaActual, setJornadaActual] = useState(1);

  const jornadaSeleccionada = jornadas.find(j => j.numero === jornadaActual) || jornadas[0];
  const totalJornadas = jornadas.length;

  const handlePrevJornada = () => {
    if (jornadaActual > 1) {
      setJornadaActual(jornadaActual - 1);
    }
  };

  const handleNextJornada = () => {
    if (jornadaActual < totalJornadas) {
      setJornadaActual(jornadaActual + 1);
    }
  };

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <div className="p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Fixture del Torneo
        </h3>

        {/* Selector de Jornada */}
        <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <Button
            variant="ghost"
            onClick={handlePrevJornada}
            disabled={jornadaActual === 1}
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-600/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <h4 className="text-white text-xl font-semibold">Jornada {jornadaActual}</h4>
            <p className="text-gray-400 text-sm">{jornadaActual} de {totalJornadas}</p>
          </div>

          <Button
            variant="ghost"
            onClick={handleNextJornada}
            disabled={jornadaActual === totalJornadas}
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-600/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Partidos de la jornada seleccionada */}
        <div className="space-y-3">
          {jornadaSeleccionada?.partidos.map((partido) => (
                  <div
                    key={partido.id}
                    className=" border border-gray-500/50 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                      {/* Equipo Local */}
                      <div className="flex items-center gap-3 flex-1 min-w-[120px]">
                        <span className="text-white">{partido.equipoLocal}</span>
                      </div>

                      {/* Resultado o VS */}
                      <div className="flex items-center gap-4">
                        {partido.estado === "jugado" ? (
                          <div className="flex items-center gap-3 bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-700/30">
                            <span className="text-white text-xl">{partido.resultadoLocal}</span>
                            <span className="text-gray-500">-</span>
                            <span className="text-white text-xl">{partido.resultadoVisitante}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-lg">VS</span>
                          </div>
                        )}
                      </div>

                      {/* Equipo Visitante */}
                      <div className="flex items-center gap-3 flex-1 min-w-[120px] justify-end">
                        <span className="text-white text-right">{partido.equipoVisitante}</span>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      {/* Equipos */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm">{partido.equipoLocal}</span>
                          {partido.estado === "jugado" && (
                            <span className="text-white text-lg font-semibold bg-purple-900/20 px-3 py-1 rounded-lg">
                              {partido.resultadoLocal}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <span className="text-gray-500 text-xs">VS</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm">{partido.equipoVisitante}</span>
                          {partido.estado === "jugado" && (
                            <span className="text-white text-lg font-semibold bg-purple-900/20 px-3 py-1 rounded-lg">
                              {partido.resultadoVisitante}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </Card>
  );
}

