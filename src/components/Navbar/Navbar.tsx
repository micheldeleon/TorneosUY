import { Link, useLocation } from "react-router-dom";
import { Trophy, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";

export interface NavItem {
  label: string;
  sectionId?: string;
  path?: string;
}

interface NavbarProps {
  title: string;
  links: NavItem[];
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Navbar({ title, links, isAuthenticated, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (link: NavItem) => {
    if (link.sectionId && location.pathname === "/") {
      const element = document.getElementById(link.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2a1a4a]/95 backdrop-blur-sm border-b border-purple-900/20">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-900" /> {/* Cambiar por logo */}
          </div>
          <span className="text-white">{title}</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            link.sectionId ? (
              <button
                key={link.sectionId}
                onClick={() => handleNavClick(link)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ) : link.path ? (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ) : null
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/perfil">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white">
                  Mi Perfil
                </Button>
              </Link>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-purple-600 text-purple-300 hover:bg-purple-600/10"
              >
                Salir
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-300 hover:bg-purple-600/10"
                >
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2a1a4a] border-t border-purple-900/20">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {links.map((link) => (
              link.sectionId ? (
                <button
                  key={link.sectionId}
                  onClick={() => {
                    handleNavClick(link);
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  {link.label}
                </button>
              ) : link.path ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : null
            ))}
            
            <div className="border-t border-purple-900/20 pt-4 mt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/perfil" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white">
                      Mi Perfil
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-purple-600 text-purple-300 hover:bg-purple-600/10"
                  >
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-purple-600 text-purple-300 hover:bg-purple-600/10"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
