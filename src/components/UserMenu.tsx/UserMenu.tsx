import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../ui/Avatar";
import { Menu, MenuItem } from "../ui/Dropdown";

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
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 focus:outline-none">
        <Avatar
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=1c1d6a&color=fff`}
          alt="User avatar"
          size="sm"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 z-30">
          <Menu>
            <MenuItem onClick={onProfile}>Perfil</MenuItem>
            <MenuItem onClick={() => console.log("Configuración")}>Configuración</MenuItem>
            <MenuItem onClick={onLogout} danger>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

