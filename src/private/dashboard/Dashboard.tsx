import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trophy, Calendar, Award, TrendingUp, PiggyBank, Lock } from "lucide-react";
import { toast } from "sonner";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProfileCard } from "../../components/Profile/ProfileCard";
import { ProfileImageUploadModal } from "../../components/Profile/ProfileImageUploadModal";
import { ChangePasswordModal } from "../../components/Profile/ChangePasswordModal";
import { DescriptionList } from "../../components/ui/DetailsUserForm/DescriptionList";
import { getUsersByIdAndEmail, requestOrganizerPermission } from "../../services/api.service";
import type { UserDetails } from "../../models/userDetails.model";
import { useApi } from "../../hooks/useApi";
import type { UserFind } from "../../models/userFind.model";
import { Skeleton } from "../../components/ui/Skeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { fetch, data, error, loading } = useApi<UserDetails, UserFind>(getUsersByIdAndEmail);
  
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>();
  const [organizerMessage, setOrganizerMessage] = useState("");
  const [organizerSubmitting, setOrganizerSubmitting] = useState(false);

  // Llamar a la API al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    try {
      const user: UserFind = JSON.parse(storedUser);
      fetch(user);
    } catch (e) {
      console.error("JSON inválido en localStorage.user", e);
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar la imagen de perfil cuando se carguen los datos
  useEffect(() => {
    if (data?.profileImageUrl) {
      setProfileImageUrl(data.profileImageUrl);
    }
  }, [data]);

  const userStats = {
    torneosParticipados: 12,
    torneosGanados: 3,
    proximosTorneos: 2,
    ganancia: "$1500",
    fechaCreacion: "Marzo 2022",
  };

  const misTorneos = [
    {
      id: 1,
      nombre: "Campeonato Fútbol 5",
      fecha: "20 nov. 2025",
      estado: "Inscrito",
      tipo: "Fútbol",
    },
    {
      id: 2,
      nombre: "Torneo CS2",
      fecha: "28 nov. 2025",
      estado: "Pendiente de pago",
      tipo: "eSports",
    },
  ];

  const handleEditProfile = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUploadSuccess = () => {
    console.log("[Dashboard] ✅ Imagen subida exitosamente. Recargando perfil...");
    // La imagen se recargará automáticamente al actualizar el componente
    // porque el backend ya devuelve la imagen actualizada
    setShowImageUploadModal(false);
  };

  const handleOrganizeClick = () => {
    setShowOrganizerForm(true);
  };

  const handleChangePasswordSuccess = () => {
    console.log("[Dashboard] ✅ Contraseña cambiada exitosamente");
    setShowChangePasswordModal(false);
  };

  const handleOrganizerRequest = async () => {
    try {
      setOrganizerSubmitting(true);
      const message = organizerMessage.trim() || undefined;
      const { call } = requestOrganizerPermission(message);
      const response = await call;
      if (response.status >= 200 && response.status < 300) {
        toast.success("Solicitud enviada. Se revisará tu petición.");
        setShowOrganizerForm(false);
        setOrganizerMessage("");
      } else {
        toast.error("No se pudo enviar la solicitud. Intenta nuevamente.");
      }
    } catch (error: any) {
      console.error("Error al solicitar permiso de organizador:", error);
      if (error?.response?.status === 409) {
        toast.error("Ya tienes una solicitud pendiente.");
        return;
      }
      toast.error("Error al solicitar permiso de organizador: " + (error?.response?.data?.message || "Error inesperado"));
    } finally {
      setOrganizerSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-white text-4xl mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Gestiona tus datos y configuración</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/50 text-red-300 rounded-lg p-4 mb-6">
            Error al cargar datos: {String(error)}
          </div>
        )}

        
        {/* Profile Info Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Profile Card with Photo */}
          <div>
            {loading ? (
              <Card className="bg-[#2a2a2a] border-gray-800 p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ) : (
              <ProfileCard
                name={data?.name ?? "Usuario"}
                email={data?.email}
                imageUrl={profileImageUrl}
                onEdit={handleEditProfile}
                
              />
            )}
          </div>

          {/* Personal Data */}
          <Card className="bg-[#2a2a2a] border-gray-800 p-6">
            <h3 className="text-white mb-4">Datos Personales</h3>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <DescriptionList data={data} />
            )}
          </Card>

          {/* Organizer Button */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-white mb-2">¿Quieres organizar?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Crea y gestiona tus propios torneos
            </p>
            <Button
              onClick={handleOrganizeClick}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
            >
              Quiero organizar torneos
            </Button>
          </Card>

          {/* Change Password Button */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 p-6 flex flex-col items-center justify-center text-center">
            <Lock className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-white mb-2">Seguridad</h3>
            <p className="text-gray-400 text-sm mb-6">
              Actualiza tu contraseña regularmente
            </p>
            <Button
              onClick={() => setShowChangePasswordModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white"
            >
              Cambiar Contraseña
            </Button>
          </Card>
        </div>
            
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-2xl text-white mb-1">{userStats.torneosParticipados}</div>
            <div className="text-gray-400 text-sm">Torneos Participados</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-2xl text-white mb-1">{userStats.torneosGanados}</div>
            <div className="text-gray-400 text-sm">Torneos Ganados</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-2xl text-white mb-1">{userStats.proximosTorneos}</div>
            <div className="text-gray-400 text-sm">Próximos Torneos</div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <PiggyBank className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-2xl text-white mb-1">{userStats.ganancia}</div>
            <div className="text-gray-400 text-sm">Ganancia</div>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-2xl text-white mb-1">{userStats.fechaCreacion}</div>
            <div className="text-gray-400 text-sm">Juega desde</div>
          </Card>
        </div>

        {/* My Tournaments */}
        <Card className="bg-[#2a2a2a] border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl">Mis Torneos</h3>
            <Badge className="bg-violet-500/10 text-violet-200 border border-violet-500/20">
              {misTorneos.length} activos
            </Badge>
          </div>
          
          <div className="space-y-4">
            {misTorneos.map((torneo) => (
              <div
                key={torneo.id}
                className="bg-[#1a1a1a] border border-gray-700 hover:border-purple-600/50 rounded-lg p-4 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {torneo.nombre}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{torneo.tipo}</span>
                      <span>•</span>
                      <span>{torneo.fecha}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      torneo.estado === "Inscrito"
                        ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-200 border border-amber-500/20"
                    }
                  >
                    {torneo.estado}
                  </Badge>
                  
                  <Link to={`/torneo/${torneo.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10"
                    >
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {misTorneos.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No estás inscrito en ningún torneo</p>
              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              >
                Explorar Torneos
              </Button>
            </div>
          )}
        </Card>

        {/* Image Upload Modal */}
        {showImageUploadModal && data && (
          <ProfileImageUploadModal
            userId={data.id}
            currentImageUrl={profileImageUrl}
            onClose={() => setShowImageUploadModal(false)}
            onSuccess={handleImageUploadSuccess}
          />
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && data && (
          <ChangePasswordModal
            userId={data.id.toString()}
            onClose={() => setShowChangePasswordModal(false)}
            onSuccess={handleChangePasswordSuccess}
          />
        )}

        {/* Organizer Form Modal/Section */}
        {showOrganizerForm && (
          <div className="fixed inset-0 bg-gradient-to-b from-login-from/85 to-login-to/95 flex items-center justify-center z-50 p-4">
            <Card className="border-gray-800 p-8 max-w-md w-full">
              <h3 className="text-white text-xl mb-4">Convertirse en Organizador</h3>
              <p className="text-gray-300 mb-6">
                Para organizar torneos, necesitamos verificar algunos datos adicionales.
                Nuestro equipo se pondrá en contacto contigo.
              </p>
              <label className="text-xs text-gray-400 mb-2 block">Mensaje (opcional)</label>
              <textarea
                value={organizerMessage}
                onChange={(e) => setOrganizerMessage(e.target.value)}
                rows={3}
                className="w-full mb-6 bg-[#1f1f1f] border border-gray-700/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
                placeholder="Cuéntanos tu experiencia organizando torneos"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowOrganizerForm(false);
                    setOrganizerMessage("");
                  }}
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleOrganizerRequest}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  disabled={organizerSubmitting}
                >
                  {organizerSubmitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
