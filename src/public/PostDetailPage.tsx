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
  Plus,
  X,
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
  const [showCommentForm, setShowCommentForm] = useState(false);
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

  const handleSubmitComentario = async () => {
    await handleCreateComentario(nuevoComentario);
    setShowCommentForm(false);
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="mb-4 text-gray-300 hover:text-white font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Blog
        </button>

        {/* Post Content */}
        <article className="border-b border-gray-800/60">
          <div className="py-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                {post.autorProfileImageUrl ? (
                  <img src={post.autorProfileImageUrl} alt={post.autorNombre || 'Usuario'} className="w-full h-full object-cover" />
                ) : (
                  post.autorNombre?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
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
                    <span>{new Date(post.fechaCreacion).toLocaleString('es-ES')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${getTipoBadgeColor()}`}>
                    {getTipoIcon()}
                    {getTipoLabel()}
                  </span>
                  {post.estado === EstadoPost.CERRADO && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-700/50 text-gray-400 border border-gray-600 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      Cerrado
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-3 leading-tight">
                  {post.titulo}
                </h1>

                <p className="text-gray-300 whitespace-pre-wrap text-base leading-relaxed mt-3">
                  {post.contenido}
                </p>

                {(post.deporte || post.ubicacion) && (
                  <div className="flex flex-wrap gap-2 mt-4 text-xs">
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

                {(isAutor && post.estado === EstadoPost.ACTIVO) || (isAviso && !isAutor && post.estado === EstadoPost.ACTIVO && user) ? (
                  <div className="flex justify-end gap-2 mt-4">
                    {isAutor && post.estado === EstadoPost.ACTIVO && (
                      <button
                        onClick={handleCerrarPost}
                        className="px-4 py-1.5 text-xs font-semibold text-gray-200 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Cerrar
                      </button>
                    )}
                    {isAviso && !isAutor && post.estado === EstadoPost.ACTIVO && user && (
                      <button
                        onClick={handleContactar}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-full transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Contactar
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Comentarios ({comentarios.length})
            </h2>
            {user ? (
              <button
                onClick={() => setShowCommentForm((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-semibold text-gray-200 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                {showCommentForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showCommentForm ? 'Cerrar' : 'Agregar comentario'}
              </button>
            ) : (
              <span className="text-xs text-gray-500">Inicia sesion para comentar</span>
            )}
          </div>

          {/* New Comment Form */}
          {user && (
            <div
              className={`mb-4 overflow-hidden transition-[max-height] duration-300 ease-out ${
                showCommentForm ? 'max-h-[260px]' : 'max-h-0'
              }`}
            >
              <div
                className={`rounded-2xl p-4 transition-all duration-300 ${
                  showCommentForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="text-xs text-gray-500 mb-2">Escribe tu comentario</div>
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  placeholder="Que opinas?"
                  className="w-full px-3 py-2 bg-transparent outline-none resize-none text-gray-200 placeholder-gray-600 text-sm"
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-600">
                    {nuevoComentario.trim().length}/500
                  </div>
                  <button
                    onClick={handleSubmitComentario}
                    disabled={!nuevoComentario.trim() || isSubmitting}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Enviando...' : 'Comentar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comentarios.length === 0 ? (
            <div className="text-center py-10 border border-gray-800/60 rounded-xl">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/60">
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
        </section>
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
