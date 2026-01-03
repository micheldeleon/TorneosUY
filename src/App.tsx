import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { NavItem } from "./components/Navbar";
import { HomeLanding, LoginForm, TournamentDetailsAlt, RegisterForm, About, Contact, Faq } from "./public";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import Dashboard from "./private/dashboard/Dashboard";
import DashboardAlt from "./private/dashboard/DashboardAlt";
import { useGlobalContext } from "./context/global.context";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { SplashScreen } from "./public/SplashScreen";
import CreateTournament from "./private/tournament/CreateTournament";
import { TournamentLive } from "./public/TournamentLive";
import { TournamentRegistration } from "./public/TournamentRegistration";
import { Toaster } from "sonner";
import { ManageTournament } from "./private/tournament/ManageTournament";
import { TournamentsExplore } from "./public/TournamentsExplore";
import { NavbarModern } from "./components/Navbar/NavbarModern";
import TournamentCanceled from "./public/TournamentCanceled";
import TournamentFinished from "./public/TournamentFinished";
import Error404 from "./public/Error404";
import { Notifications } from "./public/Notifications";
import { NotificationToastContainer } from "./components/ui/NotificationToast";
import { NotificationDetailModal } from "./components/ui/NotificationDetailModal";
import type { Notification } from "./models";
import { useApi } from "./hooks/useApi";
import { markNotificationAsRead } from "./services/api.service";



function App() {
  const { token, logout, toastNotifications, removeToastNotification, markNotificationAsReadLocal } = useGlobalContext()
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { fetch: markAsRead } = useApi(markNotificationAsRead);

  const handleOpenNotificationDetail = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleMarkAsReadFromModal = async () => {
    if (selectedNotification) {
      markNotificationAsReadLocal(selectedNotification.id);
      try {
        await markAsRead(selectedNotification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  // Solicitar permisos de notificaciones del navegador al cargar la app
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('✅ Permisos de notificaciones del navegador otorgados');
        } else {
          console.log('⚠️ Permisos de notificaciones del navegador denegados');
        }
      });
    }
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Lista de rutas válidas
  const validRoutes = [
    '/',
    '/quienes',
    '/contacto',
    '/faq',
    '/torneos',
    '/perfil',
    '/perfil2',
    '/login',
    '/signup',
    '/crearTorneo',
    '/notificaciones',
  ];

  const isValidRoute = validRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/torneo/') ||
    location.pathname.startsWith('/torneo-iniciado/') ||
    location.pathname.startsWith('/torneo-cancelado/') ||
    location.pathname.startsWith('/torneo-finalizado/') ||
    location.pathname.startsWith('/inscripcion-torneo/') ||
    location.pathname.startsWith('/manejar-torneo/');

  const hideChrome = location.pathname.startsWith("/login") || 
                     location.pathname.startsWith("/signup") ||
                     !isValidRoute;

  const navLinks: NavItem[] = [
    { label: "Inicio", sectionId: "inicio" },
    { label: "Torneos", path: "/torneos" },
    { label: "¿Quiénes somos?", sectionId: "quienes-somos" },
    { label: "Preguntas Frecuentes", sectionId: "preguntas-frecuentes" },
    { label: "Contacto", sectionId: "contacto" },
  ];
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200); // 1.2s

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />; // pantalla de carga
  }
  return (
    <>

      {/* Navbar dinámico */}
      {!hideChrome && (
        <NavbarModern
          title="TuTorneo"
          links={navLinks}
          isAuthenticated={Boolean(token)}
          onLogout={handleLogout}
        />
      )}

      {/* Rutas principales */}
      <main className="min-h-screen">
        <Routes>

          <Route path="/" element={<HomeLanding />} />
          <Route path="/quienes" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/torneo/:id" element={<TournamentDetailsAlt />} />
          <Route path="torneo-iniciado/:id" element={<TournamentLive />} />
          <Route path="torneo-cancelado/:id" element={<TournamentCanceled />} />
          <Route path="torneo-finalizado/:id" element={<TournamentFinished />} />
          <Route path="inscripcion-torneo/:id" element={<TournamentRegistration />} />
          <Route
            path="/perfil"
            element={
              <PrivateRoute isPrivate={true}>
                <DashboardAlt />
              </PrivateRoute>
            } />
          <Route
            path="/perfil2"
            element={
              <PrivateRoute isPrivate={true}>
                <Dashboard />
              </PrivateRoute>
            } />
          <Route
            path="/login"
            element={
              <PrivateRoute isPrivate={false}>
                <LoginForm />
              </PrivateRoute>
            } />
          <Route
            path="/signup"
            element={
              <PrivateRoute isPrivate={false}>
                <RegisterForm />
              </PrivateRoute>
            } />
          <Route
            path="/crearTorneo"
            element={
              <PrivateRoute isPrivate={true}>
                <CreateTournament />
              </PrivateRoute>
            }
          />
          <Route
            path="/manejar-torneo/:id"
            element={
              <PrivateRoute isPrivate={true}>
                <ManageTournament />
              </PrivateRoute>
            } />
          <Route
            path="/torneos"
            element={
              <TournamentsExplore />
            } />
          <Route
            path="/notificaciones"
            element={
              <PrivateRoute isPrivate={true}>
                <Notifications />
              </PrivateRoute>
            } />
          
          {/* Ruta 404 - Debe estar al final */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>



      {!hideChrome && <Footer />}

      {/* Toast notifications para notificaciones en tiempo real */}
      <NotificationToastContainer 
        notifications={toastNotifications}
        onRemove={removeToastNotification}
        onOpenDetail={handleOpenNotificationDetail}
      />

      {/* Modal de detalles de notificación desde toast */}
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

      {/* Global toast renderer */}
      <Toaster richColors position="top-center" />

    </>
  );
}

export default App;
