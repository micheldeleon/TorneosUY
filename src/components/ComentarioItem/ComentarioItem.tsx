import { useState, type FC } from 'react';
import type { Comentario } from '../../models';
import { Reply, User, Clock, Send, X } from 'lucide-react';

interface ComentarioItemProps {
  comentario: Comentario;
  onReply?: (comentarioId: string, contenido: string) => void;
  currentUserId?: number;
  nivel?: number;
}

const ComentarioItem: FC<ComentarioItemProps> = ({ 
  comentario, 
  onReply, 
  currentUserId,
  nivel = 0 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !onReply) return;
    
    setIsSubmitting(true);
    try {
      await onReply(comentario.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error al responder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxNivel = 3; // Máximo nivel de anidación
  const canReply = nivel < maxNivel && currentUserId;

  return (
    <div className={`${nivel > 0 ? 'ml-8 mt-4' : 'mt-4'}`}>
      <div className="bg-surface shadow shadow-sm shadow-purple-500/10 rounded-xl p-5 hover:border-purple-500/30 transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden flex-shrink-0">
            {comentario.autorProfileImageUrl ? (
              <img src={comentario.autorProfileImageUrl} alt={comentario.autorNombre || 'Usuario'} className="w-full h-full object-cover" />
            ) : comentario.autorNombre ? (
              comentario.autorNombre.charAt(0).toUpperCase()
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <span className="font-semibold text-white">
              {comentario.autorNombre || `Usuario #${comentario.autorId}`}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatDate(comentario.fechaCreacion)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-300 whitespace-pre-wrap mb-3 leading-relaxed pl-13">
          {comentario.contenido}
        </p>

        {/* Actions */}
        {canReply && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors pl-13"
          >
            <Reply className="w-4 h-4" />
            Responder
          </button>
        )}

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 bg-gray-950 rounded-lg p-4 border border-gray-700">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-200 placeholder-gray-500"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all flex items-center gap-1.5"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Enviando...' : 'Responder'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Respuestas anidadas */}
      {comentario.respuestas && comentario.respuestas.length > 0 && (
        <div className="mt-2">
          {comentario.respuestas.map((respuesta) => (
            <ComentarioItem
              key={respuesta.id}
              comentario={respuesta}
              onReply={onReply}
              currentUserId={currentUserId}
              nivel={nivel + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComentarioItem;
