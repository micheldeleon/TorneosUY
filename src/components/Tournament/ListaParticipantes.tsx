import { Users, User, Shield, X } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar, AvatarFallback } from "../ui/Avatar";

interface Participante {
  id: number;
  nombre: string;
  avatar?: string;
  estado: "activo" | "eliminado" | "retirado";
  posicion?: number;
  equipo?: string;
}

interface ListaParticipantesProps {
  participantes: Participante[];
  mostrarPosicion?: boolean;
}

export function ListaParticipantes({ participantes, mostrarPosicion = false }: ListaParticipantesProps) {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getEstadoBadge = (estado: Participante["estado"]) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-600/20 text-green-300 border-green-600/50">Activo</Badge>;
      case "eliminado":
        return <Badge className="bg-rose-600/20 text-rose-300 border-rose-600/50">Eliminado</Badge>;
      case "retirado":
        return <Badge className="bg-gray-600/20 text-gray-300 border-gray-600/50">Retirado</Badge>;
      default:
        return null;
    }
  };

  const activos = participantes.filter(p => p.estado === "activo");
  const noActivos = participantes.filter(p => p.estado !== "activo");

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Participantes
          </h3>
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/50">
            {participantes.length} total
          </Badge>
        </div>

        {/* Participantes Activos */}
        {activos.length > 0 && (
          <div className="mb-6">
            <h4 className="text-gray-400 text-sm mb-3 px-2">En Competencia ({activos.length})</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {activos.map((participante) => (
                <div
                  key={participante.id}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {mostrarPosicion && participante.posicion && (
                      <div className="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400">#{participante.posicion}</span>
                      </div>
                    )}
                    
                    <Avatar className="w-12 h-12 border-2 border-purple-600/30">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                        {getInitials(participante.nombre)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white truncate">{participante.nombre}</h4>
                      {participante.equipo && (
                        <p className="text-gray-500 text-sm truncate">{participante.equipo}</p>
                      )}
                    </div>

                    {getEstadoBadge(participante.estado)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participantes No Activos */}
        {noActivos.length > 0 && (
          <div>
            <h4 className="text-gray-400 text-sm mb-3 px-2">Fuera de Competencia ({noActivos.length})</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {noActivos.map((participante) => (
                <div
                  key={participante.id}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-gray-700">
                      <AvatarFallback className="bg-gray-700 text-gray-400">
                        {getInitials(participante.nombre)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-400 truncate">{participante.nombre}</h4>
                      {participante.equipo && (
                        <p className="text-gray-600 text-sm truncate">{participante.equipo}</p>
                      )}
                    </div>

                    {getEstadoBadge(participante.estado)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {participantes.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay participantes registrados</p>
          </div>
        )}
      </div>
    </Card>
  );
}
