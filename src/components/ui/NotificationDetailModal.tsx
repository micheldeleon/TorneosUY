import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, Bell, Trophy, Calendar, CheckCheck, Sparkles } from 'lucide-react';
import type { Notification } from '../../models';
import { Button } from './Button';
import { Badge } from './Badge';

interface NotificationDetailModalProps {
  notification: Notification;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: () => void;
}

export function NotificationDetailModal({ 
  notification, 
  isOpen, 
  onClose,
  onMarkAsRead 
}: NotificationDetailModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'WELCOME':
        return <Sparkles className="w-6 h-6" />;
      case 'TOURNAMENT_CANCELLED':
      case 'TOURNAMENT_CANCELED':
      case 'TOURNAMENT_STARTED':
      case 'TOURNAMENT_FINISHED':
        return <Trophy className="w-6 h-6" />;
      case 'NEW_MATCH':
      case 'MATCH_RESULT':
        return <Calendar className="w-6 h-6" />;
      default:
        return <Bell className="w-6 h-6" />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'WELCOME':
        return 'from-cyan-500 to-cyan-600';
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

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'WELCOME':
        return 'Bienvenida';
      case 'TOURNAMENT_CANCELLED':
      case 'TOURNAMENT_CANCELED':
        return 'Torneo Cancelado';
      case 'TOURNAMENT_STARTED':
        return 'Torneo Iniciado';
      case 'TOURNAMENT_FINISHED':
        return 'Torneo Finalizado';
      case 'NEW_MATCH':
        return 'Nuevo Partido';
      case 'MATCH_RESULT':
        return 'Resultado de Partido';
      default:
        return 'Notificación';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-UY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGoToTournament = () => {
    if (notification.relatedEntityId) {
      navigate(`/torneo/${notification.relatedEntityId}`);
      onClose();
    }
  };

  const handleMarkAsReadAndClose = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead();
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleMarkAsReadAndClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-[#1a1a1a] rounded-xl shadow-2xl max-w-md w-full border border-gray-700 overflow-hidden pointer-events-auto animate-slideInScale"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con gradiente */}
          <div className={`bg-gradient-to-r ${getColor()} p-4`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {getIcon()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{notification.title}</h3>
                  <p className="text-white/80 text-sm">{getTypeLabel()}</p>
                </div>
              </div>
              <button
                onClick={handleMarkAsReadAndClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Badge de estado */}
            {!notification.read && (
              <Badge className="bg-violet-500/10 text-violet-200 border border-violet-500/20">
                No leída
              </Badge>
            )}

            {/* Mensaje */}
            <div>
              <h4 className="text-gray-400 text-xs uppercase font-semibold mb-3">Mensaje</h4>
              <div className="text-white text-base leading-relaxed space-y-3">
                {notification.message.split('\n').map((line, index) => {
                  // Detectar si es una línea con viñeta
                  if (line.trim().startsWith('•')) {
                    return (
                      <div key={index} className="flex gap-2 pl-2">
                        <span className="text-gray-400 flex-shrink-0">•</span>
                        <span className="text-gray-200">{line.trim().substring(1).trim()}</span>
                      </div>
                    );
                  }
                  // Detectar si es una línea vacía (solo para separación)
                  if (line.trim() === '') {
                    return <div key={index} className="h-2" />;
                  }
                  // Línea normal
                  return (
                    <p key={index} className="text-gray-100">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Fecha */}
            <div>
              <h4 className="text-gray-400 text-xs uppercase font-semibold mb-2">Fecha</h4>
              <p className="text-gray-300 text-sm">
                {formatDate(notification.createdAt)}
              </p>
            </div>

            {/* Información del torneo si existe */}
            {notification.relatedEntityId && (
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400 text-xs uppercase font-semibold">
                    Torneo relacionado
                  </span>
                </div>
                <p className="text-white text-sm">
                  ID: {notification.relatedEntityId}
                </p>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          <div className="p-4 bg-gray-800/30 border-t border-gray-700 flex gap-3">
            {!notification.read && onMarkAsRead && (
              <Button
                onClick={() => {
                  onMarkAsRead();
                  onClose();
                }}
                variant="outline"
                className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-600/10"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar como leída
              </Button>
            )}
            
            {notification.relatedEntityId && (
              <Button
                onClick={handleGoToTournament}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ir al torneo
              </Button>
            )}

            {!notification.relatedEntityId && notification.read && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideInScale {
          animation: slideInScale 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
