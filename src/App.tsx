import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Navbar, type NavItem } from "./components/Navbar";
import { HomeLanding, LoginForm, TournamentDetails, RegisterForm, About, Contact, Faq } from "./public";
import { Logo } from "./components/Logo";
import { Footer } from "./components/Footer";
import Dashboard from "./private/dashboard/Dashboard";
import { GlobalProvider, useGlobalContext } from "./context/global.context";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { Button } from "./components/ui/Button";

function App() {
  const { token, logout } = useGlobalContext()
  const navigate = useNavigate();
  const location = useLocation();

  const hideChrome = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup");

  const navLinks: NavItem[] = [
    { label: "Inicio", path: "/" },
    { label: "¿Quiénes somos?", path: "/quienes" },
    { label: "Preguntas Frecuentes", path: "/faq" },
    { label: "Contacto", path: "/contacto" },
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
          title="TuToreno"
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
        </Routes>
      </main>

      {/* Patrocinadores */}
      {!hideChrome && (
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-16">
          <h3 className="text-center text-slate-700 font-semibold mb-6 ">
            Patrocinadores
          </h3>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-center ">
            <Logo text="XBOX" />
            <Logo text="Uruguay Natural" />
            <Logo text="VIBEZ" />
            <Logo text="logitech" />
          </div>
        </section>
      )}

      {!hideChrome && <Footer />}



    </>
  );
}

export default App;
