import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ComentarioItem } from '../components';
import { 
  getPostById, 
  cerrarPost, 
  contactarAviso,
  getComentariosByPost,
  createComentario
} from '../services/post.service';
import { TipoPost, EstadoPost } from '../models';
import type {
  Post, 
  Comentario, 
  CreateComentarioRequest 
} from '../models';
import { useGlobalContext } from '../context/global.context';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  MessageSquare,
  Newspaper,
  Search,
  Users,
  Zap,
  MapPin,
  Clock,
  User,
  Phone,
  Lock,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({ show: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    if (postId) {
      loadPostData();
    }
  }, [postId]);

  const loadPostData = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const [postResponse, comentariosResponse] = await Promise.all([
        getPostById(postId).call,
        getComentariosByPost(postId).call
      ]);
      
      setPost(postResponse.data);
      setComentarios(buildComentariosTree(comentariosResponse.data));
    } catch (err) {
      setError('Error al cargar la publicación');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buildComentariosTree = (comentarios: Comentario[]): Comentario[] => {
    const comentariosMap = new Map<string, Comentario>();
    const raiz: Comentario[] = [];

    // Primera pasada: crear map
    comentarios.forEach(comentario => {
      comentariosMap.set(comentario.id, { ...comentario, respuestas: [] });
    });

    // Segunda pasada: construir árbol
    comentarios.forEach(comentario => {
      const nodo = comentariosMap.get(comentario.id);
      if (!nodo) return;

      if (comentario.comentarioPadreId) {
        const padre = comentariosMap.get(comentario.comentarioPadreId);
        if (padre) {
          padre.respuestas = padre.respuestas || [];
          padre.respuestas.push(nodo);
        } else {
          raiz.push(nodo);
        }
      } else {
        raiz.push(nodo);
      }
    });

    return raiz;
  };

  const handleCreateComentario = async (contenido: string, comentarioPadreId?: string) => {
    if (!user || !post) return;

    setIsSubmitting(true);
    try {
      const comentarioData: CreateComentarioRequest = {
        postId: post.id,
        autorId: user.id,
        contenido,
        comentarioPadreId
      };

      const { call } = createComentario(comentarioData);
      await call;
      
      // Recargar comentarios
      loadPostData();
      
      // Limpiar form solo si es comentario principal
      if (!comentarioPadreId) {
        setNuevoComentario('');
      }
    } catch (err) {
      toast.error('Error al crear el comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCerrarPost = async () => {
    if (!user || !post) return;

    setConfirmDialog({
      show: true,
      title: 'Cerrar Publicación',
      message: '¿Estás seguro de que deseas cerrar esta publicación? No podrás recibir más contactos.',
      confirmText: 'Cerrar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
        try {
          const { call } = cerrarPost(post.id, user.id);
          const response = await call;
          setPost(response.data);
          toast.success('Publicación cerrada exitosamente');
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Error al cerrar la publicación');
        }
      }
    });
  };

  const handleContactar = async () => {
    if (!user || !post) return;

    setConfirmDialog({
      show: true,
      title: 'Contactar Aviso',
      message: '¿Deseas contactar con este aviso? Se revelará tu teléfono automáticamente al autor.',
      confirmText: 'Contactar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} });
        try {
          const { call } = contactarAviso(post.id, user.id);
          const response = await call;
          
          // Copiar teléfono al portapapeles
          try {
            await navigator.clipboard.writeText(response.data.telefonoRevelado);
            toast.success('¡Contacto realizado!', {
              description: `Teléfono: ${response.data.telefonoRevelado} (copiado al portapapeles)`,
              duration: 5000,
            });
          } catch (clipboardErr) {
            toast.success('¡Contacto realizado!', {
              description: `Teléfono: ${response.data.telefonoRevelado}`,
              duration: 5000,
            });
          }
          
          loadPostData();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Error al contactar el aviso');
        }
      }
    });
  };

  const getTipoBadgeColor = () => {
    if (!post) return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
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
    if (!post) return <MessageSquare className="w-5 h-5" />;
    switch (post.tipoPost) {
      case TipoPost.NOTICIA: return <Newspaper className="w-5 h-5" />;
      case TipoPost.CHAT_GENERAL: return <MessageSquare className="w-5 h-5" />;
      case TipoPost.BUSCO_EQUIPO: return <Search className="w-5 h-5" />;
      case TipoPost.EQUIPO_BUSCA_JUGADOR: return <Users className="w-5 h-5" />;
      case TipoPost.PARTIDO_URGENTE: return <Zap className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTipoLabel = () => {
    if (!post) return '';
    switch (post.tipoPost) {
      case TipoPost.NOTICIA: return 'Noticia';
      case TipoPost.CHAT_GENERAL: return 'Chat General';
      case TipoPost.BUSCO_EQUIPO: return 'Busco Equipo';
      case TipoPost.EQUIPO_BUSCA_JUGADOR: return 'Equipo Busca Jugador';
      case TipoPost.PARTIDO_URGENTE: return 'Partido Urgente';
      default: return post.tipoPost;
    }
  };

  const isAviso = post && [
    TipoPost.BUSCO_EQUIPO as string,
    TipoPost.EQUIPO_BUSCA_JUGADOR as string,
    TipoPost.PARTIDO_URGENTE as string
  ].includes(post.tipoPost);

  const isAutor = user && post && user.id === post.autorId;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center p-8 backdrop-blur-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-4">{error || 'Publicación no encontrada'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-2 border border-gray-500/40 text-white rounded-lg transition-all"
          >
            Volver al Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al Blog
        </button>

        {/* Post Content */}
        <div className="bg-gradient-to-br from-purple-700/10 via-pink-800/10 to-surface/10 rounded-xl shadow-2xl overflow-hidden mb-8">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getTipoBadgeColor()}`}>
                    {getTipoIcon()}
                    {getTipoLabel()}
                  </span>
                  {post.estado === EstadoPost.CERRADO && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-700/50 text-gray-400 border border-gray-600 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Cerrado
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
                  {post.titulo}
                </h1>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden flex-shrink-0">
                  {post.autorProfileImageUrl ? (
                    <img src={post.autorProfileImageUrl} alt={post.autorNombre || 'Usuario'} className="w-full h-full object-cover" />
                  ) : (
                    post.autorNombre?.charAt(0).toUpperCase() || <User className="w-3 h-3" />
                  )}
                </div>
                <span className="font-semibold">Por:</span> {post.autorNombre || `Usuario #${post.autorId}`}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-pink-400" />
                <span>{new Date(post.fechaCreacion).toLocaleString('es-ES')}</span>
              </div>
              {post.deporte && (
                <div className="flex items-center gap-2 text-sm bg-purple-600/10 text-purple-300 px-3 py-2 rounded-lg border border-purple-600/30">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">{post.deporte}</span>
                </div>
              )}
              {post.ubicacion && (
                <div className="flex items-center gap-2 text-sm bg-pink-600/10 text-pink-300 px-3 py-2 rounded-lg border border-pink-600/30">
                  <MapPin className="w-4 h-4" />
                  <span>{post.ubicacion}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
                {post.contenido}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-700">
              {isAutor && post.estado === EstadoPost.ACTIVO && (
                <button
                  onClick={handleCerrarPost}
                  className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Cerrar Publicación
                </button>
              )}
              {isAviso && !isAutor && post.estado === EstadoPost.ACTIVO && user && (
                <button
                  onClick={handleContactar}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Contactar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gradient-to-br from-purple-700/10 via-pink-800/10 to-surface/10 rounded-xl shadow-2xl p-8 ">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Comentarios ({comentarios.length})
          </h2>

          {/* New Comment Form */}
          {user && (
            <div className="mb-8">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-200 placeholder-gray-500"
                rows={4}
                disabled={isSubmitting}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleCreateComentario(nuevoComentario)}
                  disabled={!nuevoComentario.trim() || isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comentarios.length === 0 ? (
            <div className="text-center py-12 bg-gray-950/50 rounded-xl border border-gray-800">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </p>
            </div>
          ) : (
            <div>
              {comentarios.map((comentario) => (
                <ComentarioItem
                  key={comentario.id}
                  comentario={comentario}
                  onReply={handleCreateComentario}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="max-w-md w-full mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-700 bg-purple-900/20">
              <h3 className="text-white text-xl font-bold">{confirmDialog.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                {confirmDialog.message}
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => {} })}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {confirmDialog.cancelText || 'Cancelar'}
                </Button>
                <Button
                  onClick={confirmDialog.onConfirm}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
                >
                  {confirmDialog.confirmText || 'Confirmar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
