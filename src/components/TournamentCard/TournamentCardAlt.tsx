import { Link } from "react-router-dom";
import { Calendar, Users, DollarSign, Trophy, Target, Gamepad2, PlayIcon, PersonStanding } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export interface Tournament {
  id: number;
  tipo: string;
  nombre: string;
  costo: string;
  fecha: string;
  formato: string;
  participantes: string;
  badge: string;
  imagen?: string;
}

interface TournamentCardAltProps {
  tournament: Tournament;
}

export function TournamentCardAlt({ tournament }: TournamentCardAltProps) {
  const getIcon = () => {
    if (tournament.tipo.toLowerCase().includes("fútbol") || tournament.tipo.toLowerCase().includes("futbol")) {
      return <Trophy className="w-5 h-5" />;
    }
    if (tournament.tipo.toLowerCase().includes("ea fc") || tournament.tipo.toLowerCase().includes("fortnite")) {
      return <Gamepad2 className="w-5 h-5" />;
    }
    if (tournament.tipo.toLowerCase().includes("running")) {
      return <PersonStanding className="w-5 h-5" />;
    }
    return <Target className="w-5 h-5" />;
  };

  const getBadgeColor = (badge: string) => {
    const lower = badge.toLowerCase();
    if (lower.includes("público") ) {
      return "bg-green-600/20 text-green-300 border-green-600/50";
    }
    if (lower.includes("privado") ) {
      return "bg-rose-600/20 text-rose-300 border-rose-600/50";
    }
    return "bg-blue-600/20 text-blue-300 border-blue-600/50";
  };

  return (
    <div className="group relative bg-[#2a2a2a] border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-purple-900/20 to-purple-600/10 overflow-hidden">
        {tournament.imagen ? (
          <img 
            src={tournament.imagen} 
            alt={tournament.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity text-white">
              {getIcon()}
            </div>
          </div>
        )}
        
        {/* Badge Overlay */}
        <div className="absolute top-3 right-3">
          <Badge className={`${getBadgeColor(tournament.badge)} backdrop-blur-sm`}>
            {tournament.badge}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
            <span className="text-white text-sm">{tournament.tipo}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
          {tournament.nombre}
        </h3>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Date */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Fecha</p>
              <p className="text-white text-sm truncate">{tournament.fecha}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <PlayIcon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Formato</p>
              <p className="text-white text-sm truncate">{tournament.formato}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Inscritos</p>
              <p className="text-white text-sm truncate">{tournament.participantes}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Precio</p>
              <p className="text-white text-sm truncate">{tournament.costo}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link to={`/torneo/${tournament.id}`} className="block">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all"
          >
            Ver Detalles
          </Button>
        </Link>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/5 pointer-events-none transition-all duration-300" />
    </div>
  );
}