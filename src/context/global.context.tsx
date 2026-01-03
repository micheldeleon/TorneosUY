import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "../models/user.model";
import type { Notification } from "../models";
import { isTokenExpired, decodeJWT } from "../services/utilities/jwt.utility";
import { getAllNotifications } from "../services/api.service";
import { useNotificationStream } from "../hooks/useNotificationStream";

interface GlobalContextType {
  user: User | null;
  token: string | null;
  unreadNotifications: number;
  notifications: Notification[];
  toastNotifications: Notification[];
  isConnectedSSE: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  refreshNotifications: () => void;
  markNotificationAsReadLocal: (notificationId: number) => void;
  markAllNotificationsAsReadLocal: () => void;
  removeToastNotification: (notificationId: number) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Inicializar AudioContext después de la primera interacción del usuario
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        // Remover el listener después de la primera interacción
        document.removeEventListener('click', initAudio);
        document.removeEventListener('keydown', initAudio);
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, [audioContext]);

  // Callback para manejar notificaciones en tiempo real
  const handleRealtimeNotification = useCallback((notification: Notification) => {
    console.log('📢 Notificación en tiempo real recibida:', notification);
    
    // Agregar la notificación al inicio del array
    setNotifications(prev => [notification, ...prev]);
    
    // Incrementar contador si no está leída
    if (!notification.read) {
      setUnreadNotifications(prev => prev + 1);
    }

    // Agregar toast notification
    setToastNotifications(prev => [...prev, notification]);

    // Reproducir sonido de notificación
    try {
      // Solo reproducir si AudioContext está disponible
      if (audioContext && audioContext.state === 'running') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar el sonido
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } else if (audioContext && audioContext.state === 'suspended') {
        // Intentar reanudar si está suspendido
        audioContext.resume().then(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        });
      }
    } catch (err) {
      console.log('Error playing notification sound:', err);
    }

    // Mostrar notificación del navegador si tiene permisos (como respaldo)
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        tag: `notification-${notification.id}`,
        badge: '/logo.png',
      });

      // Cerrar automáticamente después de 5 segundos
      setTimeout(() => browserNotif.close(), 5000);
    }
  }, []);

  // Conectar al stream SSE
  const { isConnected: isConnectedSSE } = useNotificationStream(token, {
    onNotification: handleRealtimeNotification,
    onConnected: () => {
      console.log('✅ Conectado al stream de notificaciones en tiempo real');
    },
    onError: (error) => {
      console.error('❌ Error en el stream SSE:', error);
    },
  });

  // Función para actualizar notificaciones
  const refreshNotifications = async () => {
    if (!token || !user) {
      setUnreadNotifications(0);
      setNotifications([]);
      return;
    }

    // Verificar si el token es válido antes de hacer la petición
    try {
      if (isTokenExpired(token)) {
        console.warn('Token expirado, no se pueden obtener notificaciones');
        setUnreadNotifications(0);
        setNotifications([]);
        return;
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      return;
    }

    try {
      const { call } = getAllNotifications();
      const response = await call;
      if (response.data?.notifications) {
        setNotifications(response.data.notifications);
        setUnreadNotifications(response.data.unreadCount || 0);
      }
    } catch (error: any) {
      // Solo mostrar error si no es 401 o 403 (esos ya son manejados por el interceptor)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error('Error fetching notifications:', error);
      }
      setUnreadNotifications(0);
      setNotifications([]);
    }
  };

  // Marcar una notificación como leída localmente (sin esperar la API)
  const markNotificationAsReadLocal = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true, readAt: new Date().toISOString() } : notif
      )
    );
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };

  // Marcar todas las notificaciones como leídas localmente
  const markAllNotificationsAsReadLocal = () => {
    const now = new Date().toISOString();
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true, readAt: now }))
    );
    setUnreadNotifications(0);
  };

  // Remover toast notification
  const removeToastNotification = useCallback((notificationId: number) => {
    setToastNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Obtener notificaciones al cargar la app o cuando cambia el token/user
  useEffect(() => {
    if (token && user) {
      refreshNotifications();
      
      // Poll cada 30 segundos
      const interval = setInterval(refreshNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadNotifications(0);
      setNotifications([]);
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
    setNotifications([]);
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
    <GlobalContext.Provider value={{ 
      user, 
      token, 
      unreadNotifications, 
      notifications,
      toastNotifications,
      isConnectedSSE,
      setUser, 
      setToken, 
      logout, 
      refreshNotifications,
      markNotificationAsReadLocal,
      markAllNotificationsAsReadLocal,
      removeToastNotification
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext debe usarse dentro de GlobalProvider");
  return ctx;
};
