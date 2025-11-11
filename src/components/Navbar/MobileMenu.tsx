import { Link } from "react-router-dom";
import { NavLinks } from "../ui/NavLinks";
import type { NavItem } from "./Navbar";

interface Props {
  open: boolean;
  links: NavItem[];
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export const MobileMenu = ({ open, links, isAuthenticated, onLogout }: Props) => (
  <div
    className={`md:hidden origin-top transition-all duration-300 overflow-hidden ${
      open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <div className="mx-3 mb-3 rounded-xl bg-white/10 backdrop-blur p-2">
      <NavLinks
        className="flex flex-col"
        links={links.filter(l => l.path).map(l => ({ label: l.label, to: l.path! }))}
      />

      <div className="my-2 h-px bg-white/10" />

      {isAuthenticated ? (
        <div className="px-2 py-1">
          <Link to="/perfil" className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10">
            Perfil
          </Link>
          <button
            onClick={onLogout}
            className="mt-1 w-full text-left px-3 py-2 rounded-lg text-sm text-red-200 hover:bg-red-400/10"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="px-2 py-1">
          <Link
            to="/login"
            className="block px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-center"
          >
            Ingresar
          </Link>
        </div>
      )}
    </div>
  </div>
);
