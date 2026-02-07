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
import { toast } from "sonner";
import { useApi } from "../../hooks/useApi";
import {
  approveOrganizerRequest,
  deactivateAdminUser,
  deactivateAdminTournament,
  getAdminUsers,
  getAllTournaments,
  getOrganizerRequestsAdmin,
  reactivateAdminTournament,
  rejectOrganizerRequest,
  restoreAdminUser,
} from "../../services/api.service";
import type { TournamentDetails, OrganizerRequest, OrganizerRequestStatus, AdminUser } from "../../models";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "tournaments" | "organizers">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const [statusSort, setStatusSort] = useState<"none" | "asc" | "desc">("none");
  const [includeDeleted, setIncludeDeleted] = useState(true);
  const [requestStatusFilter, setRequestStatusFilter] = useState<OrganizerRequestStatus>("PENDING");
  const [approveDialog, setApproveDialog] = useState<{ open: boolean; id: number | null; note: string }>({
    open: false,
    id: null,
    note: "",
  });
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: number | null; reason: string }>({
    open: false,
    id: null,
    reason: "",
  });
  const [restoreDialog, setRestoreDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });
  const [deactivateTournamentDialog, setDeactivateTournamentDialog] = useState<{ open: boolean; id: number | null; reason: string }>({
    open: false,
    id: null,
    reason: "",
  });
  const [reactivateTournamentDialog, setReactivateTournamentDialog] = useState<{ open: boolean; id: number | null; reason: string }>({
    open: false,
    id: null,
    reason: "",
  });

  // API call para obtener torneos
  const { fetch: fetchTournaments, data: tournamentsData, loading: loadingTournaments } = useApi<TournamentDetails[], undefined>(getAllTournaments);
  const { fetch: fetchUsers, data: usersData, loading: loadingUsers } = useApi<AdminUser[], { includeDeleted?: boolean }>(getAdminUsers);
  const { fetch: fetchOrganizerRequests, data: organizerRequestsData, loading: loadingOrganizerRequests } = useApi<OrganizerRequest[], { status?: OrganizerRequestStatus }>(getOrganizerRequestsAdmin);

  // Obtener torneos al montar el componente
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    fetchUsers({ includeDeleted });
  }, [fetchUsers, includeDeleted]);

  useEffect(() => {
    if (activeTab === "organizers") {
      fetchOrganizerRequests({ status: requestStatusFilter });
    }
  }, [activeTab, fetchOrganizerRequests, requestStatusFilter]);

  // Mapear datos de la API a formato de tabla
  const tournaments = tournamentsData ? (Array.isArray(tournamentsData) ? tournamentsData : []) : [];
  const users = usersData ? (Array.isArray(usersData) ? usersData : []) : [];
  const organizerRequests = organizerRequestsData ? (Array.isArray(organizerRequestsData) ? organizerRequestsData : []) : [];

  // Log de usuarios para debugging
  useEffect(() => {
    if (usersData) {
      console.log('📊 Usuarios obtenidos de la API:', usersData);
      console.log('📊 Usuarios procesados:', users);
      console.log('📊 createdAt de cada usuario:', users.map(u => ({ id: u.id, fullName: u.fullName, createdAt: u.createdAt })));
    }
  }, [usersData]);
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
  const filteredUsers = users.filter((u) => {
    if (!normalizedQuery) return true;
    const fullName = (u.fullName ?? "").trim().toLowerCase();
    return fullName.includes(normalizedQuery) || u.email.toLowerCase().includes(normalizedQuery);
  });
  const filteredOrganizerRequests = organizerRequests.filter((r) => {
    if (!normalizedQuery) return true;
    return (
      r.userId.toString().includes(normalizedQuery) ||
      (r.message ?? "").toLowerCase().includes(normalizedQuery)
    );
  });
  const filteredTournaments = tournaments
    .filter((t) => {
      if (!normalizedQuery) return true;
      const name = t.name?.toLowerCase() || "";
      const discipline = t.discipline?.name?.toLowerCase() || "";
      const status = t.status?.toLowerCase() || "";
      const moderation = t.moderationStatus?.toLowerCase() || "";
      return (
        name.includes(normalizedQuery) ||
        discipline.includes(normalizedQuery) ||
        status.includes(normalizedQuery) ||
        moderation.includes(normalizedQuery)
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

  const getTournamentBadge = (status: string, moderationStatus?: string | null) => {
    if (moderationStatus === "DEACTIVATED") {
      return (
        <span className="px-2 py-1 bg-red-500/10 text-red-200 border border-red-500/20 rounded-md text-xs font-medium">
          Desactivado
        </span>
      );
    }
    return getStatusBadge(status);
  };

  const getRequestStatusBadge = (status: OrganizerRequestStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 rounded-md text-xs font-medium">
            Aprobada
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 bg-rose-500/10 text-rose-200 border border-rose-500/20 rounded-md text-xs font-medium">
            Rechazada
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-amber-500/10 text-amber-200 border border-amber-500/20 rounded-md text-xs font-medium">
            Pendiente
          </span>
        );
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    try {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return "—";
      return parsed.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error, value);
      return "—";
    }
  };


  const handleApproveRequest = (id: number) => {
    setApproveDialog({ open: true, id, note: "" });
  };

  const confirmApproveRequest = async () => {
    if (!approveDialog.id) return;
    try {
      const note = approveDialog.note.trim() || undefined;
      const { call } = approveOrganizerRequest({ id: approveDialog.id, note });
      await call;
      toast.success("Solicitud aprobada correctamente");
      setApproveDialog({ open: false, id: null, note: "" });
      fetchOrganizerRequests({ status: requestStatusFilter });
    } catch (error: any) {
      console.error("Error al aprobar solicitud:", error);
      toast.error(error?.response?.data?.message || "No se pudo aprobar la solicitud");
    }
  };

  const handleRejectRequest = (id: number) => {
    setRejectDialog({ open: true, id, reason: "" });
  };

  const confirmRejectRequest = async () => {
    if (!rejectDialog.id) return;
    const reason = rejectDialog.reason.trim();
    if (!reason) {
      toast.error("Debes ingresar un motivo de rechazo.");
      return;
    }
    try {
      const { call } = rejectOrganizerRequest({ id: rejectDialog.id, reason });
      await call;
      toast.success("Solicitud rechazada correctamente");
      setRejectDialog({ open: false, id: null, reason: "" });
      fetchOrganizerRequests({ status: requestStatusFilter });
    } catch (error: any) {
      console.error("Error al rechazar solicitud:", error);
      toast.error(error?.response?.data?.message || "No se pudo rechazar la solicitud");
    }
  };

  const handleDeactivateUser = async () => {
    if (!selectedDeleteUser) return;
    try {
      const { call } = deactivateAdminUser({ id: selectedDeleteUser, reason: deleteReason.trim() || undefined });
      await call;
      toast.success("Usuario desactivado correctamente");
      setSelectedDeleteUser(null);
      setDeleteReason("");
      fetchUsers({ includeDeleted });
    } catch (error: any) {
      console.error("Error al desactivar usuario:", error);
      toast.error(error?.response?.data || "No se pudo desactivar el usuario");
    }
  };

  const handleRestoreUser = (id: number) => {
    setRestoreDialog({ open: true, id });
  };

  const confirmRestoreUser = async () => {
    if (!restoreDialog.id) return;
    try {
      const { call } = restoreAdminUser(restoreDialog.id);
      await call;
      toast.success("Usuario restaurado correctamente");
      setRestoreDialog({ open: false, id: null });
      fetchUsers({ includeDeleted });
    } catch (error: any) {
      console.error("Error al restaurar usuario:", error);
      toast.error(error?.response?.data || "No se pudo restaurar el usuario");
    }
  };

  const handleDeactivateTournament = (id: number) => {
    setDeactivateTournamentDialog({ open: true, id, reason: "" });
  };

  const confirmDeactivateTournament = async () => {
    if (!deactivateTournamentDialog.id) return;
    const reason = deactivateTournamentDialog.reason.trim();
    if (!reason) {
      toast.error("Debes ingresar un motivo de desactivacion.");
      return;
    }
    try {
      const { call } = deactivateAdminTournament({ id: deactivateTournamentDialog.id, reason });
      await call;
      toast.success("Torneo desactivado correctamente");
      setDeactivateTournamentDialog({ open: false, id: null, reason: "" });
      fetchTournaments();
    } catch (error: any) {
      console.error("Error al desactivar torneo:", error);
      toast.error(error?.response?.data?.message || "No se pudo desactivar el torneo");
    }
  };

  const handleReactivateTournament = (id: number) => {
    setReactivateTournamentDialog({ open: true, id, reason: "" });
  };

  const confirmReactivateTournament = async () => {
    if (!reactivateTournamentDialog.id) return;
    try {
      const reason = reactivateTournamentDialog.reason.trim() || undefined;
      const { call } = reactivateAdminTournament({ id: reactivateTournamentDialog.id, reason });
      await call;
      toast.success("Torneo reactivado correctamente");
      setReactivateTournamentDialog({ open: false, id: null, reason: "" });
      fetchTournaments();
    } catch (error: any) {
      console.error("Error al reactivar torneo:", error);
      toast.error(error?.response?.data?.message || "No se pudo reactivar el torneo");
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
              <span className="hidden sm:inline">Solicitudes</span>
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

        {activeTab === "organizers" && (
          <div className="mb-6 max-w-full md:max-w-xs">
            <label className="text-xs text-gray-400 mb-1 block">Estado</label>
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value as OrganizerRequestStatus)}
              className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
            >
              <option value="PENDING">Pendientes</option>
              <option value="APPROVED">Aprobadas</option>
              <option value="REJECTED">Rechazadas</option>
            </select>
          </div>
        )}

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
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={includeDeleted}
                  onChange={(e) => setIncludeDeleted(e.target.checked)}
                  className="accent-violet-500"
                />
                Mostrar usuarios desactivados
              </label>
              <div className="relative overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Usuario</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Torneos Org.</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Participaciones</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Rol</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium sticky right-0 bg-surface-dark z-10 whitespace-nowrap">Acciones</th>
                      </tr>
                    </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                          Cargando usuarios...
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const fullName = user.fullName || `Usuario #${user.id}`;
                        const isActive = user.deletedAt === null;
                        const isAdmin = user.roles?.includes("ROLE_ADMIN") ?? false;
                        const isOrganizer = user.roles?.includes("ROLE_ORGANIZER") ?? false;
                        return (
                          <tr key={user.id} className="border-b border-gray-700/30 hover:bg-[#1f1f1f]/50 transition-colors">
                            <td className="py-4 px-4 min-w-[180px]">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{fullName}</p>
                                <p className="text-gray-500 text-xs mt-1">{isActive ? "Activo" : "Desactivado"}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-400 text-xs lg:text-sm min-w-[200px]">{user.email}</td>
                            <td className="py-4 px-4 text-center min-w-[120px]">{user.tournamentsOrganizedCount || 0}</td>
                            <td className="py-4 px-4 text-center min-w-[140px]">{user.totalParticipations || 0}</td>
                            <td className="py-4 px-4 min-w-[120px]">
                              {isAdmin ? (
                                <span className="flex items-center gap-1 text-violet-400 text-xs whitespace-nowrap">
                                  <Crown className="w-3 h-3" />
                                  Admin
                                </span>
                              ) : isOrganizer ? (
                                <span className="text-gray-400 text-xs">Organizador</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Usuario</span>
                              )}
                            </td>
                            <td className="py-4 px-4 sticky right-0 bg-surface-dark z-10">
                              <div className="flex items-center gap-1 flex-wrap">
                                {isActive ? (
                                  <button
                                    onClick={() => setSelectedDeleteUser(user.id)}
                                    title="Desactivar usuario"
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRestoreUser(user.id)}
                                    title="Restaurar usuario"
                                    className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  </button>
                                )}
                                <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                          No hay usuarios disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <div className="space-y-4">
              <div className="relative overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Torneo</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Disciplina</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Equipos</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Fecha</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Estado</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium sticky right-0 bg-surface-dark z-10 whitespace-nowrap">Acciones</th>
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
                      filteredTournaments.map((tournament) => {
                        const isDeactivated = tournament.moderationStatus === "DEACTIVATED";
                        return (
                        <tr key={tournament.id} className="border-b border-gray-700/30 hover:bg-[#1f1f1f]/50 transition-colors">
                          <td className="py-4 px-4 min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{tournament.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-400 text-xs lg:text-sm min-w-[150px]">{tournament.discipline?.name || "N/A"}</td>
                          <td className="py-4 px-4 text-center min-w-[100px]">{tournament.teamsInscribed || 0}</td>
                          <td className="py-4 px-4 text-gray-400 text-xs lg:text-sm whitespace-nowrap min-w-[110px]">
                            {new Date(tournament.startAt || tournament.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 min-w-[120px]">{getTournamentBadge(tournament.status, tournament.moderationStatus)}</td>
                          <td className="py-4 px-4 sticky right-0 bg-surface-dark z-10">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/torneo/${tournament.id}`)}
                                title="Ver detalles"
                                className="p-1.5 hover:bg-violet-500/20 rounded-lg transition-colors"
                              >
                                <Trophy className="w-4 h-4 text-violet-400" />
                              </button>
                              {isDeactivated ? (
                                <button
                                  onClick={() => handleReactivateTournament(tournament.id)}
                                  title="Reactivar torneo"
                                  className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeactivateTournament(tournament.id)}
                                  title="Desactivar torneo"
                                  className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              )}
                              <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )})
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
            </div>
          )}

          {/* Organizer Requests Tab */}
          {activeTab === "organizers" && (
            <div className="space-y-4">
              {loadingOrganizerRequests ? (
                <div className="text-center text-gray-400 py-10">Cargando solicitudes...</div>
              ) : filteredOrganizerRequests.length > 0 ? (
                filteredOrganizerRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-[#222222]/10 border border-gray-700/50 rounded-lg p-4 md:p-6 ring-1 ring-inset ring-white/[0.04] hover:border-violet-500/40 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-base md:text-lg font-semibold">Usuario #{request.userId}</h3>
                          {getRequestStatusBadge(request.status)}
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1 mb-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">ID: {request.userId}</span>
                        </p>
                      </div>
                      <div className="text-right text-xs md:text-sm">
                        <p className="text-gray-500 text-xs">Solicitud del</p>
                        <p className="text-gray-300">{formatDate(request.createdAt)}</p>
                      </div>
                    </div>

                    <div className="bg-[#1f1f1f]/50 rounded-lg p-3 md:p-4 mb-4 border border-gray-700/20">
                      <p className="text-gray-300 text-xs md:text-sm">
                        {request.message || "Sin mensaje"}
                      </p>
                    </div>

                    {request.status === "PENDING" && (
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center justify-center gap-2 font-medium text-sm md:text-base"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Aceptar</span>
                          <span className="sm:hidden">Aceptar</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center justify-center gap-2 font-medium text-sm md:text-base"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Rechazar</span>
                          <span className="sm:hidden">Rechazar</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-10">No hay solicitudes disponibles</div>
              )}
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
              <h3 className="text-lg md:text-xl font-semibold">Desactivar Usuario</h3>
            </div>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              ¿Estás seguro de que deseas desactivar este usuario? Esta acción se puede revertir más tarde.
            </p>
            <label className="text-xs text-gray-400 mb-2 block">Motivo (opcional)</label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={3}
              className="w-full mb-6 bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
              placeholder="Describe el motivo de la desactivación"
            />
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setSelectedDeleteUser(null);
                  setDeleteReason("");
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeactivateUser}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-colors font-medium text-sm md:text-base"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {approveDialog.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-emerald-900/20">
              <h3 className="text-white text-xl font-bold">Aprobar solicitud</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                Puedes dejar una nota opcional para la aprobación.
              </p>
              <textarea
                value={approveDialog.note}
                onChange={(e) => setApproveDialog((prev) => ({ ...prev, note: e.target.value }))}
                rows={3}
                className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
                placeholder="Nota de aprobación (opcional)"
              />
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setApproveDialog({ open: false, id: null, note: "" })}
                  className="px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmApproveRequest}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-medium text-sm"
                >
                  Aprobar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectDialog.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-rose-900/20">
              <h3 className="text-white text-xl font-bold">Rechazar solicitud</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                Indica el motivo del rechazo (obligatorio).
              </p>
              <textarea
                value={rejectDialog.reason}
                onChange={(e) => setRejectDialog((prev) => ({ ...prev, reason: e.target.value }))}
                rows={3}
                className="w-full bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
                placeholder="Motivo del rechazo"
              />
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setRejectDialog({ open: false, id: null, reason: "" })}
                  className="px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRejectRequest}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-700 hover:to-rose-900 text-white font-medium text-sm"
                  disabled={!rejectDialog.reason.trim()}
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {restoreDialog.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 bg-blue-900/20">
              <h3 className="text-white text-xl font-bold">Restaurar usuario</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                ¿Deseas restaurar este usuario?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setRestoreDialog({ open: false, id: null })}
                  className="px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRestoreUser}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium text-sm"
                >
                  Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deactivateTournamentDialog.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-sm w-full ring-1 ring-inset ring-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <h3 className="text-lg md:text-xl font-semibold">Desactivar Torneo</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Este torneo dejara de estar visible para usuarios no administradores.
            </p>
            <label className="text-xs text-gray-400 mb-2 block">Motivo (obligatorio)</label>
            <textarea
              value={deactivateTournamentDialog.reason}
              onChange={(e) => setDeactivateTournamentDialog((prev) => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="w-full mb-6 bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
              placeholder="Motivo de la desactivacion"
            />
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setDeactivateTournamentDialog({ open: false, id: null, reason: "" })}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeactivateTournament}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-colors font-medium text-sm md:text-base"
                disabled={!deactivateTournamentDialog.reason.trim()}
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}

      {reactivateTournamentDialog.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] border border-gray-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-sm w-full ring-1 ring-inset ring-white/[0.04]">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <h3 className="text-lg md:text-xl font-semibold">Reactivar Torneo</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              El torneo volvera a estar disponible para usuarios no administradores.
            </p>
            <label className="text-xs text-gray-400 mb-2 block">Motivo (opcional)</label>
            <textarea
              value={reactivateTournamentDialog.reason}
              onChange={(e) => setReactivateTournamentDialog((prev) => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="w-full mb-6 bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
              placeholder="Motivo de la reactivacion"
            />
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setReactivateTournamentDialog({ open: false, id: null, reason: "" })}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 transition-colors font-medium text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReactivateTournament}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50 transition-colors font-medium text-sm md:text-base"
              >
                Reactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
