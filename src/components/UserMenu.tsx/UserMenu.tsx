import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Menu, MenuItem } from "../ui/Dropdown";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  username?: string;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  username = "Usuario",
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const goProfile = useCallback(() => {
    navigate("/perfil");
    setOpen(false);
  }, [navigate]);

  const goSettings = useCallback(() => {
    console.log("Configuración");
    setOpen(false);
  }, []);

  const doLogout = useCallback(() => {
    onLogout?.();
    setOpen(false);
  }, [onLogout]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menú de usuario"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              username
            )}&background=1c1d6a&color=fff`}
            alt="User avatar"
          />
          <AvatarFallback>{username?.slice(0, 1).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 z-30">
          <Menu role="menu" aria-label="Menú de usuario">
            <MenuItem onClick={goProfile}>Perfil</MenuItem>
            <MenuItem onClick={goSettings}>Configuración</MenuItem>
            <MenuItem onClick={doLogout} danger>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};
