import { Route, Routes } from "react-router-dom";
import { Navbar, type NavItem } from "./components/Navbar/Navbar";
import { HomeLanding } from "./public/HomeLanding";
import { Faq } from "./public/FAQ";
import { Logo } from "./components/Logo/Logo";
import { Footer } from "./components/Footer/Footer";
import LoginForm from "./public/login/LoginForm";
import RegisterForm from "./public/register/RegisterForm";

function App() {
  const navLinks: NavItem[] = [
    { label: "Inicio", path: "/" },
    { label: "¿Quiénes somos?", path: "/quienes" },
    { label: "Preguntas Frecuentes", path: "/faq" },
    { label: "Contacto", path: "/contacto" },
  ];

  return (
    <>
      {/* Navbar dinámico */}
      <Navbar
        title="TORNEOS UY"
        links={navLinks}
        isAuthenticated={false} // cambiar a true cuando haya sesión
      />

      {/* Rutas principales */}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomeLanding />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} />
        </Routes>
      </main>

      {/* Patrocinadores */}
      <section className="mx-auto max-w-6xl px-4 pt-10">
        <h3 className="text-center text-slate-700 font-semibold mb-6">
          Patrocinadores
        </h3>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 items-center">
          <Logo text="XBOX" />
          <Logo text="Uruguay Natural" />
          <Logo text="VIBEZ" />
          <Logo text="logitech" />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default App;
