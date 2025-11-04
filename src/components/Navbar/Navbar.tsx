import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserMenu } from "../UserMenu.tsx/UserMenu";
import { NavLinks } from "../ui/NavLinks";
import { MobileMenu } from "./MobileMenu";

export interface NavItem {
  label: string;
  path: string;
}

interface NavbarProps {
  title?: string;
  links: NavItem[];
  isAuthenticated?: boolean;
  username?: string;
  onLogout?: () => void;
}
export const Navbar = ({
  title = "Gestión de torneos",
  links,
  isAuthenticated = false,
  username,
  onLogout,
}: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al navegar
  useEffect(() => setOpen(false), [location.pathname]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-brand-start to-brand-end text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
            🏆
          </span>
          <span className="font-semibold">{title}</span>
        </div>

        {/* Desktop links */}
        <NavLinks
          className="hidden md:flex items-center gap-8 text-sm"
          links={links.map((l) => ({ label: l.label, to: l.path }))}
        />

        {/* User / Login */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <UserMenu username={username ?? "Usuario"} onLogout={onLogout} />
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold hover:bg-white/20 transition"
            >
              Ingresar
            </Link>
          )}
        </div>

        {/* Botón hamburguesa */}
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          {!open ? "☰" : "✕"}
        </button>
      </div>

      {/* Mobile menu */}
      <div ref={menuRef}>
        <MobileMenu
          open={open}
          links={links}
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};
