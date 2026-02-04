import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Trophy,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  Mail,
  Search,
  MoreVertical,
  AlertCircle,
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { getAllTournaments } from "../../services/api.service";
import type { TournamentDetails } from "../../models";

// Mock data - será reemplazado con API calls cuando esté lista
const mockUsers = [
  {
    id: 1,
    name: "Juan García",
    email: "juan@example.com",
    createdAt: "2024-01-15",
    tournamentsOrganized: 3,
    tournamentsParticipated: 12,
    isAdmin: false,
    status: "active",
  },
  {
    id: 2,
    name: "María López",
    email: "maria@example.com",
    createdAt: "2024-02-20",
    tournamentsOrganized: 5,
    tournamentsParticipated: 8,
    isAdmin: false,
    status: "active",
  },
  {
    id: 3,
    name: "Carlos Martínez",
    email: "carlos@example.com",
    createdAt: "2024-03-10",
    tournamentsOrganized: 2,
    tournamentsParticipated: 15,
    isAdmin: false,
    status: "active",
  },
];

const mockOrganizerRequests = [
  {
    id: 1,
    userName: "Patricia Rodríguez",
    email: "patricia@example.com",
    requestDate: "2024-02-28",
    reason: "Quiero organizar torneos de fútbol profesionales",
    tournaments: 0,
  },
  {
    id: 2,
    userName: "Diego Fernández",
    email: "diego@example.com",
    requestDate: "2024-02-25",
    reason: "Experiencia en organización de eventos esports",
    tournaments: 2,
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "tournaments" | "organizers">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<number | null>(null);
  const [selectedDeleteTournament, setSelectedDeleteTournament] = useState<number | null>(null);
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [statusSort, setStatusSort] = useState<"none" | "asc" | "desc">("none");

  // API call para obtener torneos
  const { fetch: fetchTournaments, data: tournamentsData, loading: loadingTournaments } = useApi<TournamentDetails[], undefined>(getAllTournaments);

  // Obtener torneos al montar el componente
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  // Mapear datos de la API a formato de tabla
  const tournaments = tournamentsData ? (Array.isArray(tournamentsData) ? tournamentsData : []) : [];
  const disciplines = [
    "all",
    ...Array.from(
      new Set(
        tournaments
          .map((t) => t.discipline?.name)
          .filter((name): name is string => Boolean(name))
      )
    ),
  ];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = mockUsers.filter((u) => {
    if (!normalizedQuery) return true;
    return (
      u.name.toLowerCase().includes(normalizedQuery) ||
      u.email.toLowerCase().includes(normalizedQuery)
    );
  });
  const filteredOrganizerRequests = mockOrganizerRequests.filter((r) => {
    if (!normalizedQuery) return true;
    return (
      r.userName.toLowerCase().includes(normalizedQuery) ||
      r.email.toLowerCase().includes(normalizedQuery)
    );
  });
  const filteredTournaments = tournaments
    .filter((t) => {
      if (!normalizedQuery) return true;
      const name = t.name?.toLowerCase() || "";
      const discipline = t.discipline?.name?.toLowerCase() || "";
      const status = t.status?.toLowerCase() || "";
      return (
        name.includes(normalizedQuery) ||
        discipline.includes(normalizedQuery) ||
        status.includes(normalizedQuery)
      );
    })
    .filter((t) => disciplineFilter === "all" || t.discipline?.name === disciplineFilter)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return dateSort === "asc" ? aDate - bDate : bDate - aDate;
    })
    .sort((a, b) => {
      if (statusSort === "none") return 0;
      const aStatus = (a.status || "").toLowerCase();
      const bStatus = (b.status || "").toLowerCase();
      if (aStatus === bStatus) return 0;
      return statusSort === "asc" ? aStatus.localeCompare(bStatus) : bStatus.localeCompare(aStatus);
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ABIERTO":
        return (
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 rounded-md text-xs font-medium">
            Abierto
          </span>
        );
      case "INICIADO":
        return (
          <span className="px-2 py-1 bg-rose-500/10 text-rose-200 border border-rose-500/20 rounded-md text-xs font-medium">
            Iniciado
          </span>
        );
      case "CANCELADO":
        return (
          <span className="px-2 py-1 bg-amber-500/10 text-amber-200 border border-amber-500/20 rounded-md text-xs font-medium">
            Cancelado
          </span>
        );
      case "FINALIZADO":
        return (
          <span className="px-2 py-1 bg-slate-500/10 text-slate-200 border border-slate-500/20 rounded-md text-xs font-medium">
            Finalizado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-violet-500/10 text-violet-200 border border-violet-500/20 rounded-md text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark pt-24 pb-12">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-violet-500" />
            <h1 className="text-2xl md:text-3xl font-bold">Panel Administrativo</h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base">Gestiona usuarios, torneos y solicitudes de organizadores</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "users"
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Usuarios</span>
              <span className="sm:hidden">Usuarios</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "tournaments"
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Torneos</span>
              <span className="sm:hidden">Torneos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("organizers")}
            className={`px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap text-sm md:text-base ${
              activeTab === "organizers"
                ? "border-violet-500 text-violet-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Solicitudes ({mockOrganizerRequests.length})</span>
              <span className="sm:hidden">Solicitudes</span>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-full md:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-500" />
            <input
              type="text"
              placeholder={activeTab === "users" ? "Buscar usuario..." : "Buscar..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Tournament Filters */}
        {activeTab === "tournaments" && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Disciplina</label>
              <select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                {disciplines.map((name) => (
                  <option key={name} value={name}>
                    {name === "all" ? "Todas" : name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ordenar por fecha</label>
              <select
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value as "asc" | "desc")}
                className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="desc">Más recientes</option>
                <option value="asc">Más antiguos</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ordenar por estado</label>
              <select
                value={statusSort}
                onChange={(e) => setStatusSort(e.target.value as "none" | "asc" | "desc")}
                className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
              >
                <option value="none">Sin ordenar</option>
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="w-full">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Usuario</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Registro</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden xl:table-cell">Torneos Org.</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden xl:table-cell">Participaciones</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Rol</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-700/30 hover:bg-[#1f1f1f]/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-gray-400 text-xs md:hidden truncate">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-400 hidden md:table-cell text-xs lg:text-sm">{user.email}</td>
                        <td className="py-4 px-4 text-gray-400 hidden lg:table-cell text-xs">{user.createdAt}</td>
                        <td className="py-4 px-4 hidden xl:table-cell">{user.tournamentsOrganized}</td>
                        <td className="py-4 px-4 hidden xl:table-cell">{user.tournamentsParticipated}</td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          {user.isAdmin ? (
                            <span className="flex items-center gap-1 text-violet-400 text-xs">
                              <Crown className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Usuario</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {!user.isAdmin && (
                              <button
                                title="Hacer Administrador"
                                className="p-1.5 hover:bg-violet-500/20 rounded-lg transition-colors"
                              >
                                <Crown className="w-4 h-4 text-violet-400" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedDeleteUser(user.id)}
                              title="Eliminar usuario"
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors hidden md:inline-flex">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Torneo</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Disciplina</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Equipos</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Fecha</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">Estado</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingTournaments ? (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                          Cargando torneos...
                        </td>
                      </tr>
                    ) : filteredTournaments && filteredTournaments.length > 0 ? (
                      filteredTournaments.map((tournament) => (
                        <tr key={tournament.id} className="border-b border-gray-700/30 hover:bg-[#1f1f1f]/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{tournament.name}</p>
                                <p className="text-gray-400 text-xs md:hidden">{tournament.discipline?.name || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-400 hidden md:table-cell text-xs lg:text-sm">{tournament.discipline?.name || "N/A"}</td>
                          <td className="py-4 px-4 hidden lg:table-cell">{tournament.teamsInscribed || 0}</td>
                          <td className="py-4 px-4 hidden lg:table-cell text-gray-400 text-xs lg:text-sm">
                            {new Date(tournament.startAt || tournament.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 hidden sm:table-cell">{getStatusBadge(tournament.status)}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/torneo/${tournament.id}`)}
                                title="Ver detalles"
                                className="p-1.5 hover:bg-violet-500/20 rounded-lg transition-colors"
                              >
                                <Trophy className="w-4 h-4 text-violet-400" />
                              </button>
                              <button
                                onClick={() => setSelectedDeleteTournament(tournament.id)}
                                title="Eliminar torneo"
                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors hidden md:inline-flex">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                          No hay torneos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Organizer Requests Tab */}
          {activeTab === "organizers" && (
            <div className="space-y-4">
              {filteredOrganizerRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-[#222222]/10 border border-gray-700/50 rounded-lg p-4 md:p-6 ring-1 ring-inset ring-white/[0.04] hover:border-violet-500/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-semibold">{request.userName}</h3>
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-200 border border-amber-500/20 rounded-md text-xs font-medium">
                          Pendiente
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1 mb-2">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{request.email}</span>
                      </p>
                    </div>
                    <div className="text-right text-xs md:text-sm">
                      <p className="text-gray-500 text-xs">Solicitud del</p>
                      <p className="text-gray-300">{request.requestDate}</p>
                    </div>
                  </div>

                  <div className="bg-[#1f1f1f]/50 rounded-lg p-3 md:p-4 mb-4 border border-gray-700/20">
                    <p className="text-gray-300 text-xs md:text-sm">{request.reason}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-xs md:text-sm">
                      Torneos organizados: <span className="text-white font-semibold">{request.tournaments}</span>
                    </span>
                  </div>

                  <div className="flex gap-2 flex-col sm:flex-row">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center justify-center gap-2 font-medium text-sm md:text-base">
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Aceptar</span>
                      <span className="sm:hidden">Aceptar</span>
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center justify-center gap-2 font-medium text-sm md:text-base">
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Rechazar</span>
                      <span className="sm:hidden">Rechazar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {selectedDeleteUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-sm w-full ring-1 ring-inset ring-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <h3 className="text-lg md:text-xl font-semibold">Eliminar Usuario</h3>
            </div>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setSelectedDeleteUser(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm md:text-base"
              >
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-colors font-medium text-sm md:text-base">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tournament Confirmation Modal */}
      {selectedDeleteTournament && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-sm w-full ring-1 ring-inset ring-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <h3 className="text-lg md:text-xl font-semibold">Eliminar Torneo</h3>
            </div>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              ¿Estás seguro de que deseas eliminar este torneo? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setSelectedDeleteTournament(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm md:text-base"
              >
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-colors font-medium text-sm md:text-base">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
