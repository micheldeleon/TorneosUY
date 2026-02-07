import { useState, type FC } from 'react';
import type { Comentario } from '../../models';
import { User, Clock, Send, X } from 'lucide-react';

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

  return (
    <div className={`${nivel > 0 ? 'ml-8' : ''} border-b border-gray-800/60 py-4`}>
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden flex-shrink-0">
          {comentario.autorProfileImageUrl ? (
            <img src={comentario.autorProfileImageUrl} alt={comentario.autorNombre || 'Usuario'} className="w-full h-full object-cover" />
          ) : comentario.autorNombre ? (
            comentario.autorNombre.charAt(0).toUpperCase()
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-semibold text-gray-200 truncate">
              {comentario.autorNombre || `Usuario #${comentario.autorId}`}
            </span>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatDate(comentario.fechaCreacion)}</span>
            </div>
          </div>

          <p className="text-gray-300 whitespace-pre-wrap mt-2 leading-relaxed text-sm">
            {comentario.contenido}
          </p>

          {/* {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="mt-2 flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Responder
            </button>
          )} */}

          {showReplyForm && (
            <div className="mt-3 border border-gray-800/60 rounded-xl p-3 bg-gray-950/40">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full bg-transparent outline-none resize-none text-gray-200 placeholder-gray-600 text-sm"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-300 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || isSubmitting}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Enviando...' : 'Responder'}
                </button>
              </div>
            </div>
          )}
        </div>
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
