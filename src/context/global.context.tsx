import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../models/user.model";
import { isTokenExpired, decodeJWT } from "../services/utilities/jwt.utility";
import { getUnreadNotificationsCount } from "../services/api.service";

interface GlobalContextType {
  user: User | null;
  token: string | null;
  unreadNotifications: number;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  refreshNotifications: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const LS_TOKEN = "token";
const LS_USER  = "user";

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(LS_USER);
    if (!raw) return null;
    try { return JSON.parse(raw) as User; } catch { return null; }
  });
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  // Función para actualizar notificaciones
  const refreshNotifications = async () => {
    if (!token || !user) {
      setUnreadNotifications(0);
      return;
    }

    try {
      const { call } = getUnreadNotificationsCount();
      const response = await call;
      // El backend devuelve directamente el número
      const count = typeof response.data === 'number' ? response.data : (response.data?.count || 0);
      setUnreadNotifications(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setUnreadNotifications(0);
    }
  };

  // Obtener notificaciones al cargar la app o cuando cambia el token/user
  useEffect(() => {
    if (token && user) {
      refreshNotifications();
      
      // Poll cada 30 segundos
      const interval = setInterval(refreshNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadNotifications(0);
    }
  }, [token, user]);

  // 2) Persistencia: token
  useEffect(() => {
    if (token) localStorage.setItem(LS_TOKEN, token);
    else localStorage.removeItem(LS_TOKEN);
  }, [token]);

  // 3) Persistencia: user
  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  const logout = () => {
    setToken(null);
    setUser(null);
    setUnreadNotifications(0);
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem("isOrganizer"); // Limpiar también el estado de organizador
  };

  // 5) Sincronización multi-pestaña
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_TOKEN) setToken(localStorage.getItem(LS_TOKEN));
      if (e.key === LS_USER) {
        const raw = localStorage.getItem(LS_USER);
        setUser(raw ? (() => { try { return JSON.parse(raw) as User; } catch { return null; } })() : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 6) Verificar expiración del JWT al montar y cuando cambia el token
  useEffect(() => {
    if (!token) return;
    
    try {
      if (isTokenExpired(token)) {
        console.warn('Token expirado, cerrando sesión...');
        logout();
      } else {
        // Si el token es válido, extraer y guardar el rol de organizador
        const decoded = decodeJWT<{ authorities?: string[] }>(token);
        const isOrganizer = decoded?.authorities?.includes("ROLE_ORGANIZER") ?? false;
        localStorage.setItem("isOrganizer", JSON.stringify(isOrganizer));
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      logout();
    }
  }, [token]);

  // 7) Verificación periódica del token (cada minuto)
  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(() => {
      try {
        if (isTokenExpired(token)) {
          console.warn('Token expirado detectado en verificación periódica, cerrando sesión...');
          logout();
        }
      } catch (error) {
        console.error('Error en verificación periódica del token:', error);
        logout();
      }
    }, 60000); // Verificar cada 60 segundos

    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <GlobalContext.Provider value={{ user, token, unreadNotifications, setUser, setToken, logout, refreshNotifications }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext debe usarse dentro de GlobalProvider");
  return ctx;
};
