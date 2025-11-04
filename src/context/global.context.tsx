import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../models/user.model";

interface GlobalContextType {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
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
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
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

  // 6) (Opcional) Verificar expiración del JWT al montar
  // useEffect(() => {
  //   if (!token) return;
  //   try {
  //     const [, payloadB64] = token.split(".");
  //     const payload = JSON.parse(atob(payloadB64));
  //     const now = Math.floor(Date.now() / 1000);
  //     if (payload.exp && now >= payload.exp) logout();
  //   } catch {
  //     // token inválido → fuera
  //     logout();
  //   }
  // }, [token]);

  return (
    <GlobalContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext debe usarse dentro de GlobalProvider");
  return ctx;
};
