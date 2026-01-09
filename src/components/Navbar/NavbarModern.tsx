import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, LogOut, User, ChevronDown, Bell } from "lucide-react";
import { Button } from "../ui/Button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "../../context/global.context";

export interface NavItem {
  label: string;
  sectionId?: string;
  path?: string;
}

interface NavbarModernProps {
  title: string;
  links: NavItem[];
  isAuthenticated: boolean;
  onLogout: () => void;
}

// Función para obtener las iniciales del nombre
export function NavbarModern({ title, links, isAuthenticated, onLogout }: NavbarModernProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const { unreadNotifications } = useGlobalContext();

  // Obtener el nombre del usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.fullName || "Usuario");
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUserName("Usuario");
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (link: NavItem) => {
    if (!link.sectionId) return;

    if (location.pathname === "/") {
      const element = document.getElementById(link.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // si estamos en otra ruta, navegamos a / y le pasamos el id en state
      navigate("/", { state: { scrollTo: link.sectionId } });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl shadow-lg shadow-purple-900/10 border-b border-purple-600/20"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-55 transition-opacity" />
                
                {/* Logo container */}
                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform overflow-hidden">
                  <img 
                    src="/logoTuTorneo png.png" 
                    alt="Logo TuTorneo" 
                    className="w-10 h-10 object-contain"
                  />                 
                </div>
              </div>
              
              <div className="hidden sm:block">
                <span className="text-xl bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                  {title}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                link.sectionId ? (
                  <button
                    key={link.sectionId}
                    onClick={() => handleNavClick(link)}
                    className="relative px-4 py-2 text-gray-300 hover:text-white transition-all group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-3/4 transition-all duration-300" />
                  </button>
                ) : link.path ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-4 py-2 text-gray-300 hover:text-white transition-all group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Hover background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Animated underline */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-3/4 transition-all duration-300" />
                  </Link>
                ) : null
              ))}
            </div>

            {/* Right side - Auth buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2">
                  {/* Notifications Bell */}
                  <Link to="/notificaciones" className="relative">
                    <button className="relative p-2 text-gray-300 hover:text-white hover:bg-purple-600/10 rounded-xl transition-all">
                      <Bell className="w-5 h-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      )}
                    </button>
                  </Link>

                  {/* User Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/60 hover:to-purple-700/60 border border-purple-600/30 rounded-xl text-white backdrop-blur-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{userName}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-[#1a1a1a]/95 backdrop-blur-xl border border-purple-600/30 rounded-xl shadow-lg shadow-purple-900/20 overflow-hidden"
                        >
                          <Link
                            to="/perfil"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-600/10 transition-all"
                          >
                            <User className="w-4 h-4" />
                            <span>Mi Perfil</span>
                          </Link>
                          <button
                            onClick={() => {
                              onLogout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-rose-600/10 transition-all border-t border-purple-600/20"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-white hover:bg-purple-600/10"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all group">
                      <span className="relative z-10 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Registrarse Gratis
                      </span>
                      
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-purple-900/5 hover:bg-purple-800/40 border border-purple-600/5 rounded-xl text-white transition-all backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-purple-600/30 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-purple-900/30 hover:bg-purple-800/40 border border-purple-600/30 rounded-xl text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mb-8">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.sectionId || link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {link.sectionId ? (
                        <button
                          onClick={() => handleNavClick(link)}
                          className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-600/10 rounded-xl transition-all"
                        >
                          {link.label}
                        </button>
                      ) : link.path ? (
                        <Link
                          to={link.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-600/10 rounded-xl transition-all"
                        >
                          {link.label}
                        </Link>
                      ) : null}
                    </motion.div>
                  ))}
                </div>

                {/* Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                  className="space-y-3 pt-6 border-t border-purple-600/20"
                >
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/notificaciones"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full relative bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/60 hover:to-purple-700/60 border border-purple-600/30 text-white backdrop-blur-sm">
                          <Bell className="w-4 h-4 mr-2" />
                          Notificaciones
                          {unreadNotifications > 0 && (
                            <span className="absolute top-2 right-2 w-5 h-5 bg-rose-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {unreadNotifications > 9 ? '9+' : unreadNotifications}
                            </span>
                          )}
                        </Button>
                      </Link>
                      <Link
                        to="/perfil"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-purple-900/50 to-purple-800/50 hover:from-purple-800/60 hover:to-purple-700/60 border border-purple-600/30 text-white backdrop-blur-sm">
                          <User className="w-4 h-4 mr-2" />
                          Mi Perfil
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          onLogout();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-rose-600/50 text-rose-300 hover:bg-rose-600/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-purple-600/50 text-purple-300 hover:bg-purple-600/10"
                        >
                          Iniciar Sesión
                        </Button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Registrarse Gratis
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>

                {/* Footer info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-6 border-t border-purple-600/20"
                >
                  <p className="text-gray-500 text-sm text-center">
                    © 2025 TuTorneo
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
