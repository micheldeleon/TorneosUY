import { useEffect, useState } from 'react';
import { X, Bell, Trophy, Calendar } from 'lucide-react';
import type { Notification } from '../../models';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onOpenDetail: (notification: Notification) => void;
  duration?: number;
}

export function NotificationToast({ notification, onClose, onOpenDetail, duration = 5000 }: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación de salida
  };

  const handleClick = () => {
    onOpenDetail(notification);
    handleClose();
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'TOURNAMENT_CANCELLED':
      case 'TOURNAMENT_CANCELED':
      case 'TOURNAMENT_STARTED':
      case 'TOURNAMENT_FINISHED':
        return <Trophy className="w-5 h-5" />;
      case 'NEW_MATCH':
      case 'MATCH_RESULT':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'TOURNAMENT_CANCELLED':
      case 'TOURNAMENT_CANCELED':
        return 'from-rose-500 to-rose-600';
      case 'TOURNAMENT_STARTED':
        return 'from-green-500 to-green-600';
      case 'TOURNAMENT_FINISHED':
        return 'from-blue-500 to-blue-600';
      case 'NEW_MATCH':
        return 'from-purple-500 to-purple-600';
      case 'MATCH_RESULT':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-[9999] max-w-sm w-full
        transition-all duration-300 ease-out
        ${isExiting ? 'translate-y-[-120%] opacity-0' : 'translate-y-0 opacity-100'}
      `}
      style={{
        animation: isExiting ? 'none' : 'slideInFromTop 0.3s ease-out'
      }}
    >
      <div
        onClick={handleClick}
        className="
          bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-2xl 
          cursor-pointer hover:scale-[1.02] transition-transform duration-200
          overflow-hidden
        "
      >
        {/* Barra de color superior */}
        <div className={`h-1 bg-gradient-to-r ${getColor()}`} />
        
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icono */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              bg-gradient-to-r ${getColor()} text-white
            `}>
              {getIcon()}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-white font-semibold text-sm leading-tight">
                  {notification.title}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">
                {notification.message}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {notification.relatedEntityId 
                  ? 'Haz clic para ver detalles y opciones'
                  : 'Haz clic para ver todas las notificaciones'}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="h-1 bg-gray-800 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getColor()}`}
            style={{
              animation: `progressBar ${duration}ms linear`
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideInFromTop {
          from {
            transform: translateY(-120%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Componente contenedor para múltiples toasts
interface NotificationToastContainerProps {
  notifications: Notification[];
  onRemove: (id: number) => void;
  onOpenDetail: (notification: Notification) => void;
}

export function NotificationToastContainer({ notifications, onRemove, onOpenDetail }: NotificationToastContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-2 p-4 pointer-events-auto">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => onRemove(notification.id)}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </div>
  );
}
