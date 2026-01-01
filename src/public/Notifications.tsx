import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff, CheckCheck, ArrowLeft, Trash2, Calendar, Trophy } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/api.service";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useGlobalContext } from "../context/global.context";

export function Notifications() {
  const navigate = useNavigate();
  const { refreshNotifications } = useGlobalContext();
  
  const { data: notifications, loading, fetch: refetchNotifications } = useApi(getAllNotifications, {
    autoFetch: true,
  });

  const { fetch: markAsRead } = useApi(markNotificationAsRead);
  const { fetch: markAllAsRead } = useApi(markAllNotificationsAsRead);

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
    refetchNotifications();
    refreshNotifications(); // Actualizar el contador global
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetchNotifications();
    refreshNotifications(); // Actualizar el contador global
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TOURNAMENT_CANCELLED":
      case "TOURNAMENT_STARTED":
      case "TOURNAMENT_FINISHED":
        return <Trophy className="w-5 h-5" />;
      case "NEW_MATCH":
      case "MATCH_RESULT":
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "TOURNAMENT_CANCELLED":
        return "bg-rose-600/20 text-rose-300 border-rose-600/50";
      case "TOURNAMENT_STARTED":
        return "bg-green-600/20 text-green-300 border-green-600/50";
      case "TOURNAMENT_FINISHED":
        return "bg-blue-600/20 text-blue-300 border-blue-600/50";
      case "NEW_MATCH":
        return "bg-purple-600/20 text-purple-300 border-purple-600/50";
      case "MATCH_RESULT":
        return "bg-yellow-600/20 text-yellow-300 border-yellow-600/50";
      default:
        return "bg-gray-600/20 text-gray-300 border-gray-600/50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Extraer el array de notificaciones de la respuesta
  const notificationsList = Array.isArray(notifications?.notifications) 
    ? notifications.notifications 
    : [];
  const unreadCount = notifications?.unreadCount || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark pt-24 pb-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">Notificaciones</h1>
                {unreadCount > 0 && (
                  <p className="text-gray-400">
                    Tienes {unreadCount} notificación{unreadCount > 1 ? 'es' : ''} sin leer
                  </p>
                )}
              </div>
            </div>

            {notificationsList && notificationsList.length > 0 && unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-600/10"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notificationsList && notificationsList.length > 0 ? (
          <div className="space-y-3">
            {notificationsList.map((notification: any) => (
              <Card
                key={notification.id}
                className={`bg-[#2a2a2a] border-gray-800 p-4 transition-all hover:border-purple-600/50 ${
                  !notification.read ? 'border-l-4 border-l-purple-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white font-medium">{notification.title}</h3>
                      {!notification.read && (
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/50 flex-shrink-0">
                          Nueva
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500 text-xs">
                        {formatDate(notification.createdAt)}
                      </span>

                      {!notification.read && (
                        <Button
                          onClick={() => handleMarkAsRead(notification.id)}
                          size="sm"
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10"
                        >
                          <CheckCheck className="w-4 h-4 mr-1" />
                          Marcar como leída
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[#2a2a2a] border-gray-800 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellOff className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-white text-xl mb-2">No tienes notificaciones</h3>
              <p className="text-gray-400">
                Cuando recibas actualizaciones sobre tus torneos, aparecerán aquí
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
