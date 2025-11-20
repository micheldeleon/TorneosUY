import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar, type NavItem } from "./components/Navbar";
import { HomeLanding, LoginForm, TournamentDetails, RegisterForm, About, Contact, Faq } from "./public";
import { Logo } from "./components/Logo";
import { Footer } from "./components/Footer";
import Dashboard from "./private/dashboard/Dashboard";
import { useGlobalContext } from "./context/global.context";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { CreateTournament } from "./private/tournament/CreateTournament";


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
          <Route path="/torneo/:id" element={<TournamentDetails />} />
          <Route
            path="/perfil"
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
