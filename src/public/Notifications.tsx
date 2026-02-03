import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff, CheckCheck, ArrowLeft, Calendar, Trophy, Sparkles } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { markNotificationAsRead, markAllNotificationsAsRead } from "../services/api.service";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { NotificationDetailModal } from "../components/ui/NotificationDetailModal";
import { useGlobalContext } from "../context/global.context";
import type { Notification } from "../models";

export function Notifications() {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadNotifications, 
    refreshNotifications,
    token,
    markNotificationAsReadLocal,
    markAllNotificationsAsReadLocal 
  } = useGlobalContext();

  const { fetch: markAsRead } = useApi(markNotificationAsRead);
  const { fetch: markAllAsRead } = useApi(markAllNotificationsAsRead);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Refrescar notificaciones al entrar a la página (solo si hay token)
  useEffect(() => {
    if (token) {
      refreshNotifications();
    }
  }, [token]);

  const handleMarkAsRead = async (notificationId: number) => {
    // Actualizar el estado global inmediatamente para feedback instantáneo
    markNotificationAsReadLocal(notificationId);
    
    // Llamar a la API en segundo plano (sin esperar ni refrescar inmediatamente)
    try {
      await markAsRead(notificationId);
      // No refrescamos aquí para evitar revertir el cambio local antes de que el backend lo procese
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Si falla, refrescar para revertir
      await refreshNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    // Actualizar el estado global inmediatamente para feedback instantáneo
    markAllNotificationsAsReadLocal();
    
    // Llamar a la API en segundo plano (sin esperar ni refrescar inmediatamente)
    try {
      await markAllAsRead();
      // No refrescamos aquí para evitar revertir el cambio local antes de que el backend lo procese
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Si falla, refrescar para revertir
      await refreshNotifications();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleMarkAsReadFromModal = () => {
    if (selectedNotification) {
      handleMarkAsRead(selectedNotification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "WELCOME":
        return <Sparkles className="w-5 h-5" />;
      case "TOURNAMENT_CANCELLED":
      case "TOURNAMENT_CANCELED":
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
      case "WELCOME":
        return "bg-cyan-600/20 text-cyan-300 border-cyan-600/50";
      case "TOURNAMENT_CANCELLED":
      case "TOURNAMENT_CANCELED":
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
                {unreadNotifications > 0 && (
                  <p className="text-gray-400">
                    Tienes {unreadNotifications} notificación{unreadNotifications > 1 ? 'es' : ''} sin leer
                  </p>
                )}
              </div>
            </div>

            {notifications.length > 0 && unreadNotifications > 0 && (
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
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: Notification) => (
              <Card
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-[#2a2a2a] border-gray-800 p-4 transition-all hover:border-purple-600/50 cursor-pointer ${
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
                        <Badge className="bg-violet-500/10 text-violet-200 border border-violet-500/20 flex-shrink-0">
                          Nueva
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-500 text-xs">
                        {formatDate(notification.createdAt)}
                      </span>

                      <div className="flex items-center gap-2">
                        {notification.relatedEntityId && (
                          <span className="text-xs text-purple-400">
                            Haz clic para ver detalles
                          </span>
                        )}
                      </div>
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

      {/* Modal de detalles */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedNotification(null);
          }}
          onMarkAsRead={handleMarkAsReadFromModal}
        />
      )}
    </div>
  );
}
