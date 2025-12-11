import { Trophy, Award } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface Duelo {
  id: number;
  equipo1: string;
  equipo2?: string;
  resultado1?: number;
  resultado2?: number;
  ganador?: string;
  estado: "jugado" | "pendiente" | "en_vivo";
  esCampeon?: boolean;
}

interface Etapa {
  nombre: string;
  duelos: Duelo[];
}

interface BracketEliminatoriaProps {
  etapas: Etapa[];
}

export function BracketEliminatoria({ etapas }: BracketEliminatoriaProps) {
  const getEstadoColor = (estado: Duelo["estado"]) => {
    switch (estado) {
      case "jugado":
        return "border-gray-700";
      case "en_vivo":
        return "border-green-600 bg-green-600/5";
      case "pendiente":
        return "border-purple-600/50";
      default:
        return "border-gray-800";
    }
  };

  const renderDuelo = (duelo: Duelo) => {
    // Si es un campeón (solo 1 equipo)
    if (duelo.esCampeon) {
      return (
        <div
          key={duelo.id}
          className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-2 border-yellow-600/50 rounded-xl overflow-hidden hover:border-yellow-500/70 transition-colors"
        >
          <div className="flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {duelo.equipo1 ? duelo.equipo1.substring(0, 2).toUpperCase() : "?"}
                </span>
              </div>
              <span className="text-white font-bold text-lg text-center">
                {duelo.equipo1 || "Por definir"}
              </span>
              {duelo.estado === "pendiente" && (
                <span className="text-yellow-300 text-sm">Pendiente</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Duelo normal con 2 equipos
    const isGanador1 = duelo.ganador === duelo.equipo1;
    const isGanador2 = duelo.ganador === duelo.equipo2;

    return (
      <div
        key={duelo.id}
        className={`bg-[#1a1a1a] border-2 ${getEstadoColor(duelo.estado)} rounded-xl overflow-hidden hover:border-purple-600/50 transition-colors`}
      >
        {/* Equipo 1 */}
        <div className={`flex items-center justify-between p-3 ${isGanador1 ? 'bg-purple-900/20' : ''}  border-b border-gray-800`}>
          <div className="flex items-center gap-2 flex-1">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">
                {duelo.equipo1 ? duelo.equipo1.substring(0, 2).toUpperCase() : "?"}
              </span>
            </div> */}
            <span className={`text-sm ${isGanador1 ? 'text-purple-400' : 'text-gray-400'} truncate`}>
              {duelo.equipo1 || "Por definir"}
            </span>
          </div>
          {duelo.estado === "jugado" && duelo.resultado1 !== undefined && (
            <span className={`text-lg ml-2 ${isGanador1 ? 'text-white' : 'text-gray-500'}`}>
              {duelo.resultado1}
            </span>
          )}
        </div>

        {/* Equipo 2 */}
        <div className={`flex items-center justify-between p-3 ${isGanador2 ? 'bg-purple-900/20' : ''} `}>
          <div className="flex items-center gap-2 flex-1">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">
                {duelo.equipo2 ? duelo.equipo2.substring(0, 2).toUpperCase() : "?"}
              </span>
            </div> */}
            <span className={`text-sm ${isGanador2 ? 'text-purple-400' : 'text-gray-400'} truncate`}>
              {duelo.equipo2 || "Por definir"}
            </span>
            {isGanador2 && <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
          </div>
          {duelo.estado === "jugado" && duelo.resultado2 !== undefined && (
            <span className={`text-lg ml-2 ${isGanador2 ? 'text-white' : 'text-gray-500'}`}>
              {duelo.resultado2}
            </span>
          )}
        </div>

        {/* Estado Badge */}
        {duelo.estado === "en_vivo" && (
          <div className="px-3 py-2 bg-green-600/10 border-t border-green-600/30">
            <Badge className="bg-green-600/20 text-green-300 border-green-600/50 w-full justify-center animate-pulse">
              En Vivo
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <div className="p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          Cuadro de Eliminación
        </h3>

        {/* Desktop Bracket */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6">
            {etapas.map((etapa, etapaIndex) => (
              <div key={etapaIndex} className="space-y-4">
                <h4 className="text-white text-center px-3 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-lg">
                  {etapa.nombre}
                </h4>
                <div className="space-y-4">
                  {etapa.duelos.map(renderDuelo)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Bracket */}
        <div className="lg:hidden space-y-6">
          {etapas.map((etapa, etapaIndex) => (
            <div key={etapaIndex}>
              <h4 className="text-white mb-4 px-4 py-2 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-l-4 border-purple-600 rounded">
                {etapa.nombre}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {etapa.duelos.map(renderDuelo)}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-6 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-purple-600/50 rounded"></div>
              <span className="text-gray-400">Próximo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-green-600 bg-green-600/5 rounded"></div>
              <span className="text-gray-400">En vivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-700 rounded"></div>
              <span className="text-gray-400">Finalizado</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
