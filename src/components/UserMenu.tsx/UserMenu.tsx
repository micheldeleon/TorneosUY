import React, { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  username?: string;
  onProfile?: () => void;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  username = "Usuario",
  onProfile,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            username
          )}&background=1c1d6a&color=fff`}
          alt="User avatar"
          className="w-8 h-8 rounded-full border border-white/30"
        />
      </button>

      {/* Menú desplegable */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-lg shadow-lg overflow-hidden z-30">
          <button
            onClick={onProfile}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
          >
            Perfil
          </button>
          <button
            onClick={() => console.log("Configuración")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
          >
            Configuración
          </button>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
