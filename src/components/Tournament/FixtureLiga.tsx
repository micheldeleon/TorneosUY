import { Calendar, MapPin } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

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
  const getEstadoBadge = (estado: Partido["estado"]) => {
    switch (estado) {
      case "jugado":
        return <Badge className="bg-gray-600/20 text-gray-300 border-gray-600/50">Finalizado</Badge>;
      case "en_vivo":
        return <Badge className="bg-green-600/20 text-green-300 border-green-600/50 animate-pulse">En Vivo</Badge>;
      case "pendiente":
        return <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/50">Próximo</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <div className="p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Fixture del Torneo
        </h3>

        <div className="space-y-6">
          {jornadas.map((jornada) => (
            <div key={jornada.numero}>
              <div className="mb-4">
                <h4 className="text-white px-4 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-l-4 border-purple-600 rounded">
                  Jornada {jornada.numero}
                </h4>
              </div>

              <div className="space-y-3">
                {jornada.partidos.map((partido) => (
                  <div
                    key={partido.id}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      {/* Equipo Local */}
                      <div className="flex items-center gap-3 flex-1 min-w-[120px]">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">
                            {partido.equipoLocal.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
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
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">
                            {partido.equipoVisitante.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info adicional */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {partido.fecha && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {partido.fecha}
                          </span>
                        )}
                        {partido.hora && (
                          <span>{partido.hora}</span>
                        )}
                      </div>
                      {getEstadoBadge(partido.estado)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
