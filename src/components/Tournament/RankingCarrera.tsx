import { Crown, Medal, Trophy, Target } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar, AvatarFallback } from "../ui/Avatar";

interface Competidor {
  posicion: number;
  nombre: string;
}

interface RankingCarreraProps {
  competidores: Competidor[];
}

export function RankingCarrera({ competidores }: RankingCarreraProps) {
  const getPosicionIcon = (pos: number) => {
    if (pos === 1) return { icon: Crown, color: "text-yellow-400", bg: "bg-yellow-600/20", border: "border-yellow-600/50" };
    if (pos === 2) return { icon: Medal, color: "text-gray-300", bg: "bg-gray-600/20", border: "border-gray-600/50" };
    if (pos === 3) return { icon: Medal, color: "text-orange-400", bg: "bg-orange-600/20", border: "border-orange-600/50" };
    return { icon: Target, color: "text-purple-400", bg: "bg-purple-600/20", border: "border-purple-600/50" };
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getValorMostrar = (competidor: Competidor) => {
    return `#${competidor.posicion}`;
  };

  return (
    <Card className="bg-[#2a2a2a] border-gray-800">
      <div className="p-6">
        <h3 className="text-white mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          Clasificación
        </h3>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {competidores.slice(0, 3).map((competidor) => {
            const iconData = getPosicionIcon(competidor.posicion);
            const IconComponent = iconData.icon;

            return (
              <div
                key={competidor.posicion}
                className={`relative ${competidor.posicion === 1 ? 'order-2' : competidor.posicion === 2 ? 'order-1' : 'order-3'}`}
              >
                <div className={`bg-gradient-to-br ${competidor.posicion === 1 ? 'from-yellow-900/30 to-yellow-600/20 border-yellow-700/50' : competidor.posicion === 2 ? 'from-gray-800/30 to-gray-700/20 border-gray-600/50' : 'from-orange-900/30 to-orange-700/20 border-orange-700/50'} border-2 rounded-2xl p-4 text-center ${competidor.posicion === 1 ? 'pt-6' : 'pt-8'}`}>
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${iconData.bg} ${iconData.border} border-2 rounded-full p-2`}>
                    <IconComponent className={`w-6 h-6 ${iconData.color}`} />
                  </div>
                  
                  <Avatar className={`mx-auto mb-3 ${competidor.posicion === 1 ? 'w-20 h-20' : 'w-16 h-16'} border-4 ${competidor.posicion === 1 ? 'border-yellow-600/50' : competidor.posicion === 2 ? 'border-gray-600/50' : 'border-orange-600/50'}`}>
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                      {getInitials(competidor.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h4 className={`text-white mb-1 truncate ${competidor.posicion === 1 ? 'text-lg' : ''}`}>
                    {competidor.nombre}
                  </h4>
                  <p className={`${iconData.color} ${competidor.posicion === 1 ? 'text-xl' : 'text-lg'}`}>
                    {getValorMostrar(competidor)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest of Rankings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 py-2 text-gray-500 text-sm border-b border-gray-800">
            <span>Posición</span>
            <span>Equipo</span>
          </div>
          
          {competidores.slice(3).map((competidor) => {
            const iconData = getPosicionIcon(competidor.posicion);

            return (
              <div
                key={competidor.posicion}
                className="flex items-center justify-between bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-purple-600/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Badge className={`${iconData.bg} ${iconData.color} ${iconData.border} w-10 h-10 rounded-lg flex items-center justify-center text-lg`}>
                    {competidor.posicion}
                  </Badge>
                  
                  <Avatar className="w-10 h-10 border-2 border-purple-600/30">
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-800 text-white text-sm">
                      {getInitials(competidor.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <span className="text-white">{competidor.nombre}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
