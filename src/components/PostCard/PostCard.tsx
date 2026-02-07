import type { FC } from 'react';
import type { Post } from '../../models';
import { TipoPost, EstadoPost } from '../../models';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Newspaper, 
  Search, 
  Users, 
  Zap, 
  MapPin, 
  Clock,
  Phone
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onContactar?: (postId: string) => void;
  currentUserId?: number;
}

const PostCard: FC<PostCardProps> = ({ post, onContactar, currentUserId }) => {
  const navigate = useNavigate();
  const isAutor = currentUserId === post.autorId;
  const isAviso = [
    TipoPost.BUSCO_EQUIPO as string,
    TipoPost.EQUIPO_BUSCA_JUGADOR as string,
    TipoPost.PARTIDO_URGENTE as string
  ].includes(post.tipoPost);

  const getTipoBadgeColor = () => {
    switch (post.tipoPost) {
      case TipoPost.NOTICIA: return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case TipoPost.CHAT_GENERAL: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case TipoPost.BUSCO_EQUIPO: return 'bg-green-500/20 text-green-300 border-green-500/50';
      case TipoPost.EQUIPO_BUSCA_JUGADOR: return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case TipoPost.PARTIDO_URGENTE: return 'bg-pink-500/20 text-pink-300 border-pink-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getTipoIcon = () => {
    switch (post.tipoPost) {
      case TipoPost.NOTICIA: return <Newspaper className="w-4 h-4" />;
      case TipoPost.CHAT_GENERAL: return <MessageSquare className="w-4 h-4" />;
      case TipoPost.BUSCO_EQUIPO: return <Search className="w-4 h-4" />;
      case TipoPost.EQUIPO_BUSCA_JUGADOR: return <Users className="w-4 h-4" />;
      case TipoPost.PARTIDO_URGENTE: return <Zap className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTipoLabel = () => {
    switch (post.tipoPost) {
      case TipoPost.NOTICIA: return 'Noticia';
      case TipoPost.CHAT_GENERAL: return 'Chat General';
      case TipoPost.BUSCO_EQUIPO: return 'Busco Equipo';
      case TipoPost.EQUIPO_BUSCA_JUGADOR: return 'Equipo Busca Jugador';
      case TipoPost.PARTIDO_URGENTE: return 'Partido Urgente';
      default: return post.tipoPost;
    }
  };

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
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <article
      className="group border-b border-gray-800/60 bg-transparent cursor-pointer"
      onClick={() => navigate(`/posts/${post.id}`)}
    >
      <div className="px-4 py-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden flex-shrink-0">
            {post.autorProfileImageUrl ? (
              <img src={post.autorProfileImageUrl} alt={post.autorNombre || 'Usuario'} className="w-full h-full object-cover" />
            ) : (
              post.autorNombre?.charAt(0).toUpperCase() || 'U'
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="font-semibold text-gray-200 truncate">
                {post.autorNombre || `Usuario #${post.autorId}`}
              </span>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(post.fechaCreacion)}</span>
              </div>
              {post.cantidadComentarios !== undefined && (
                <>
                  <span className="text-gray-500">•</span>
                  <span className="text-purple-400 text-xs">
                    {post.cantidadComentarios} comentarios
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${getTipoBadgeColor()}`}>
                {getTipoIcon()}
                {getTipoLabel()}
              </span>
              {post.estado === EstadoPost.CERRADO && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-700/50 text-gray-400 border border-gray-600">
                  Cerrado
                </span>
              )}
            </div>

            <Link to={`/posts/${post.id}`} className="block mt-2">
              <h3 className="text-base font-semibold text-white line-clamp-2">
                {post.titulo}
              </h3>
            </Link>

            <p className="text-gray-300 text-sm mt-2 line-clamp-3 leading-relaxed">
              {post.contenido}
            </p>

            {(post.deporte || post.ubicacion) && (
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {post.deporte && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-600/10 text-purple-300 rounded-lg border border-purple-600/30">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="font-medium">{post.deporte}</span>
                  </div>
                )}
                {post.ubicacion && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-pink-600/10 text-pink-300 rounded-lg border border-pink-600/30">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{post.ubicacion}</span>
                  </div>
                )}
              </div>
            )}

            {isAviso && !isAutor && post.estado === EstadoPost.ACTIVO && onContactar && (
              <div className="flex justify-end mt-3">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onContactar(post.id);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  Contactar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
