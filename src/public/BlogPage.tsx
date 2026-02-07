import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCard, CreatePostForm } from '../components';
import {
  getPosts,
  getPostsByTipo,
  createPost,
  contactarAviso
} from '../services/post.service';
import { TipoPost } from '../models';
import type { Post, CreatePostRequest } from '../models';
import { useGlobalContext } from '../context/global.context';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import {
  Plus,
  MessageSquare,
  Newspaper,
  Search,
  Users,
  Zap,
  LayoutGrid,
  Loader2,
  AlertCircle
} from 'lucide-react';

const BlogPage = () => {
  const { user } = useGlobalContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('TODOS');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [contactandoPostId, setContactandoPostId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({ show: false, title: '', message: '', onConfirm: () => { } });

  const filters = [
    { value: 'TODOS', label: 'Todos', icon: <LayoutGrid className="w-4 h-4" /> },
    { value: TipoPost.NOTICIA, label: 'Noticias', icon: <Newspaper className="w-4 h-4" /> },
    { value: TipoPost.CHAT_GENERAL, label: 'Chat General', icon: <MessageSquare className="w-4 h-4" /> },
    { value: TipoPost.BUSCO_EQUIPO, label: 'Busco Equipo', icon: <Search className="w-4 h-4" /> },
    { value: TipoPost.EQUIPO_BUSCA_JUGADOR, label: 'Equipo Busca', icon: <Users className="w-4 h-4" /> },
    { value: TipoPost.PARTIDO_URGENTE, label: 'Urgente', icon: <Zap className="w-4 h-4" /> }
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedFilter]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { call } = selectedFilter === 'TODOS'
        ? getPosts()
        : getPostsByTipo(selectedFilter);

      const response = await call;
      setPosts(response.data);
    } catch (err) {
      setError('Error al cargar las publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData: CreatePostRequest) => {
    try {
      const { call } = createPost(postData);
      await call;
      setShowCreateForm(false);
      loadPosts();
    } catch (err) {
      throw new Error('Error al crear la publicación');
    }
  };

  const handleContactar = async (postId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (contactandoPostId) return; // Evitar doble clic

    setConfirmDialog({
      show: true,
      title: 'Contactar Aviso',
      message: '¿Deseas contactar con este aviso? Se revelará tu teléfono automáticamente al autor.',
      confirmText: 'Contactar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => { } });
        setContactandoPostId(postId);
        try {
          const { call } = contactarAviso(postId, user.id);
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

          // Recargar posts para actualizar estado
          loadPosts();
        } catch (err: any) {
          const errorMsg = err.response?.data?.message || 'Error al contactar el aviso';
          toast.error('Error', {
            description: errorMsg,
          });
        } finally {
          setContactandoPostId(null);
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <AlertCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Inicia sesión para ver el blog
          </h2>
          <p className="text-gray-400 mb-6">
            Accede a noticias, chats y avisos deportivos
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/30"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                Blog y Avisos Deportivos
              </h1>
              <p className="text-gray-400">
                Noticias, chats y avisos de la comunidad
              </p>
            </div>
          </div>

          {/* Sticky Create Form */}
          <div className="sticky top-20 z-20 -mx-4 sm:mx-0 mb-6">
            <div className="rounded-2xl bg-surface/80 backdrop-blur px-3 py-3 sm:px-4">
              <div
                className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
                  showCreateForm ? 'max-h-[900px]' : 'max-h-0'
                }`}
                aria-hidden={!showCreateForm}
              >
                <div
                  className={`transition-all duration-300 ${
                    showCreateForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <CreatePostForm
                    onSubmit={handleCreatePost}
                    currentUserId={user.id}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </div>
              </div>
              <div
                className={`transition-all duration-300 ${
                  showCreateForm ? 'opacity-0 pointer-events-none max-h-0' : 'opacity-100 max-h-[96px]'
                }`}
                aria-hidden={showCreateForm}
              >
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full px-4 py-3 rounded-full border border-gray-800/60 text-gray-400 hover:text-white hover:border-purple-500/60 transition-colors flex items-center justify-between"
                >
                  <span>Que quieres publicar hoy?</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setSelectedFilter(filter.value);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 border ${selectedFilter === filter.value
                    ? 'border-purple-500 bg-purple-500/15 text-purple-300'
                    : 'border-gray-700 text-gray-400 hover:border-purple-500/50 hover:text-purple-300'
                  }`}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>



        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Cargando publicaciones...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gradient-to-br from-purple-700/10 via-pink-800/10 to-surface/10 rounded-xl">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadPosts}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-purple-700/10 via-pink-800/10 to-surface/10 rounded-xl">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              No hay publicaciones aún
            </p>
            <p className="text-gray-500">
              ¡Sé el primero en crear una!
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-800/60 -mx-4 sm:mx-0">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onContactar={handleContactar}
                currentUserId={user.id}
              />
            ))}
          </div>
        )}
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
                  onClick={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: () => { } })}
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

export default BlogPage;
