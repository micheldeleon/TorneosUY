import { Link } from "react-router-dom";
import { Calendar, Users, DollarSign, Trophy, Target, Gamepad2, PlayIcon, PersonStanding, LockIcon, Play, XCircle, CheckCircle, DoorClosed } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import type { TournamentDetails } from "../../models";

interface TournamentCardAltProps {
  tournament: TournamentDetails;
}

export function TournamentCardAlt({ tournament }: TournamentCardAltProps) {
  const getIcon = () => {
    const disciplineName = tournament.discipline.name?.toLowerCase() || "";
    if (disciplineName.includes("fútbol") || disciplineName.includes("futbol")) {
      return <Trophy className="w-5 h-5" />;
    }
    if (disciplineName.includes("ea fc") || disciplineName.includes("fortnite")) {
      return <Gamepad2 className="w-5 h-5" />;
    }
    if (disciplineName.includes("running")) {
      return <PersonStanding className="w-5 h-5" />;
    }
    return <Target className="w-5 h-5" />;
  };

const getImageColor = (disciplineName: string) => {
    const lower = disciplineName.toLowerCase();
    if (lower.includes("fútbol") || lower.includes("futbol")) {
      return "from-purple-700/10 to-green-600/10";
    }
    if (lower.includes("ea fc") || lower.includes("fortnite")) {
      return "from-purple-700/10 to-blue-600/10";
    }
    if (lower.includes("running")) {
      return "from-purple-700/10 to-orange-600/10";
    }
    if (lower.includes("basketball")) {
    return "from-purple-700/10 to-yellow-700/10";
    }
    return "from-purple-700/10 to-pink-800/10";
  }

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "abierto" || lower === "open") {
      return "bg-transparent px-4 text-blue-400";
    }
    if (lower === "iniciado" || lower === "started" || lower === "in_progress") {
      return "bg-transparent px-4 text-red-400 animate-pulse";
    }
    if (lower === "cancelado" || lower === "cancelled" || lower === "canceled") {
      return "bg-transparent px-4 text-yellow-400";
    }
    if (lower === "finalizado" || lower === "finished" || lower === "completed") {
      return "bg-transparent px-4 text-green-300";
    }
    return "bg-transparent px-4 text-yellow-300";
  };

  const getStatusIcon = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "abierto" || lower === "open") {
      return <DoorClosed className="w-4 h-4" />;
    }
    if (lower === "iniciado" || lower === "started" || lower === "in_progress") {
      return <Play className="w-4 h-4" />;
    }
    if (lower === "cancelado" || lower === "cancelled" || lower === "canceled") {
      return <XCircle className="w-4 h-4" />;
    }
    if (lower === "finalizado" || lower === "finished" || lower === "completed") {
      return <CheckCircle className="w-4 h-4" />;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const estadoTorneo = tournament.status ? tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1).toLowerCase() : "";

  return (
    <div className="group relative bg-[#222222]/10 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {tournament.imageUrl ? (
          // Si hay imagen, mostrarla
          <img 
            src={tournament.imageUrl} 
            alt={tournament.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Si no hay imagen, mantener el diseño actual con gradiente e icono
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${getImageColor(tournament.discipline.name || "")}`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getImageColor(tournament.discipline.name || "")} flex items-center justify-center opacity-50 group-hover:opacity-70 transition-opacity text-white`}>
                {getIcon()}
              </div>
            </div>
          </>
        )}
        
        {/* Overlay gradient para mejorar legibilidad de badges */}
        {tournament.imageUrl && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
        )}

        {/* Badge Overlay */}
        <div className="absolute top-3 right-3">
          {tournament.privateTournament && (
            <Badge className={`bg-transparent text-rose-400 backdrop-blur-sm`}>
              <LockIcon className="w-4 h-4" />Privado
            </Badge>
          )}
          <Badge className={`${getStatusColor(tournament.status)} backdrop-blur-sm `}>
            {getStatusIcon(tournament.status || "")} {estadoTorneo}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
            <span className="text-white text-sm">{tournament.discipline.name || "Disciplina"}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4 bg-gradient-to-b from-white/[0.02] to-transparent">
        {/* Title */}
        <h3 className="text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
          {tournament.name}
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
              <p className="text-white text-sm truncate">{formatDate(tournament.startAt)}</p>
            </div>
          </div>

          {/* Format */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <PlayIcon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Formato</p>
              <p className="text-white text-sm truncate">{tournament.format.name}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Inscritos</p>
              <p className="text-white text-sm truncate">{tournament.teamsInscribed}/{tournament.maxParticipantsPerTournament}</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-4 h-4 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-500 text-xs">Precio</p>
              <p className="text-white text-sm truncate">${tournament.registrationCost}</p>
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
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/5 pointer-events-none transition-all duration-300" />
    </div>
  );
}
