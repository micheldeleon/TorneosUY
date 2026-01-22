import { useState, type FC } from 'react';
import { TipoPost } from '../../models';
import type { CreatePostRequest } from '../../models';
import { 
  MessageSquare, 
  Newspaper, 
  Search, 
  Users, 
  Zap, 
  MapPin, 
  Send,
  X,
  AlertCircle
} from 'lucide-react';

interface CreatePostFormProps {
  onSubmit: (post: CreatePostRequest) => Promise<void>;
  currentUserId: number;
  onCancel?: () => void;
}

const CreatePostForm: FC<CreatePostFormProps> = ({ onSubmit, currentUserId, onCancel }) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    titulo: '',
    contenido: '',
    autorId: currentUserId,
    tipoPost: TipoPost.CHAT_GENERAL,
    deporte: '',
    ubicacion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tiposPost = [
    { value: TipoPost.CHAT_GENERAL, label: 'Chat General', icon: <MessageSquare className="w-5 h-5" /> },
    { value: TipoPost.NOTICIA, label: 'Noticia', icon: <Newspaper className="w-5 h-5" /> },
    { value: TipoPost.BUSCO_EQUIPO, label: 'Busco Equipo', icon: <Search className="w-5 h-5" /> },
    { value: TipoPost.EQUIPO_BUSCA_JUGADOR, label: 'Equipo Busca Jugador', icon: <Users className="w-5 h-5" /> },
    { value: TipoPost.PARTIDO_URGENTE, label: 'Partido Urgente', icon: <Zap className="w-5 h-5" /> }
  ];

  const isAviso = [
    TipoPost.BUSCO_EQUIPO as string,
    TipoPost.EQUIPO_BUSCA_JUGADOR as string,
    TipoPost.PARTIDO_URGENTE as string
  ].includes(formData.tipoPost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      setError('El título y contenido son obligatorios');
      return;
    }

    if (isAviso && !formData.deporte?.trim()) {
      setError('El deporte es obligatorio para avisos');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        deporte: formData.deporte?.trim() || undefined,
        ubicacion: formData.ubicacion?.trim() || undefined
      });
      // Reset form
      setFormData({
        titulo: '',
        contenido: '',
        autorId: currentUserId,
        tipoPost: TipoPost.CHAT_GENERAL,
        deporte: '',
        ubicacion: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-700/10 via-pink-800/10 to-surface/10 rounded-xl shadow-2xl p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
        Crear Nueva Publicación
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Post */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Tipo de Publicación
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {tiposPost.map((tipo) => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setFormData({ ...formData, tipoPost: tipo.value })}
                className={`p-4 text-sm font-medium rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.tipoPost === tipo.value
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/20'
                    : 'border-gray-700 text-gray-400 hover:border-purple-500/50 hover:bg-purple-600/10 hover:text-purple-300'
                }`}
              >
                {tipo.icon}
                <span className="text-xs text-center leading-tight">{tipo.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-300 mb-2">
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ej: Busco equipo de fútbol 5 para torneo"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            maxLength={200}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-2">
            {formData.titulo.length}/200 caracteres
          </p>
        </div>

        {/* Contenido */}
        <div>
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-300 mb-2">
            Contenido *
          </label>
          <textarea
            id="contenido"
            value={formData.contenido}
            onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
            placeholder="Describe tu publicación..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white placeholder-gray-500"
            rows={6}
            disabled={isSubmitting}
          />
        </div>

        {/* Deporte (obligatorio para avisos) */}
        {isAviso && (
          <div>
            <label htmlFor="deporte" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Deporte *
            </label>
            <input
              id="deporte"
              type="text"
              value={formData.deporte || ''}
              onChange={(e) => setFormData({ ...formData, deporte: e.target.value })}
              placeholder="Ej: Fútbol 5, Básquet, Vóley"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Ubicación (opcional) */}
        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-400" />
            Ubicación {isAviso && '(Recomendado)'}
          </label>
          <input
            id="ubicacion"
            type="text"
            value={formData.ubicacion || ''}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            placeholder="Ej: Montevideo - Pocitos"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all flex items-center gap-2"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formData.titulo.trim() || !formData.contenido.trim()}
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
