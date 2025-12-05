import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar, type NavItem } from "./components/Navbar";
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



function App() {
  const { token, logout } = useGlobalContext()
  const navigate = useNavigate();
  const location = useLocation();



  const hideChrome = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup");

  const navLinks: NavItem[] = [
    { label: "Inicio", sectionId: "inicio" },
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
        <Navbar
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
          <Route path="torneo-iniciado/:id" element={<TournamentLive/>} />
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
        </Routes>
      </main>



      {!hideChrome && <Footer />}



    </>
  );
}

export default App;
