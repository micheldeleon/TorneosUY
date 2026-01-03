import { useEffect, useRef, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import type { Notification } from '../models';

interface UseNotificationStreamOptions {
  onNotification?: (notification: Notification) => void;
  onConnected?: () => void;
  onError?: (error: Event) => void;
}

export const useNotificationStream = (
  token: string | null,
  options?: UseNotificationStreamOptions
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    // No conectar si no hay token
    if (!token) {
      setIsConnected(false);
      return;
    }

    console.log('🔔 Iniciando conexión SSE...');

    // Crear conexión SSE con Authorization header
    const eventSource = new EventSourcePolyfill(
      'http://localhost:8080/api/notifications/stream',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        heartbeatTimeout: 60000, // 60 segundos
      }
    );

    eventSourceRef.current = eventSource;

    // Evento de conexión establecida
    eventSource.addEventListener('connected', (event: any) => {
      console.log('✅ SSE Connected:', event.data);
      setIsConnected(true);
      setError(null);
      options?.onConnected?.();
    });

    // Evento de nueva notificación
    eventSource.addEventListener('notification', (event: any) => {
      try {
        const notification: Notification = JSON.parse(event.data);
        console.log('📬 Nueva notificación recibida:', notification);
        options?.onNotification?.(notification);
      } catch (err) {
        console.error('❌ Error parsing notification:', err);
      }
    });

    // Manejo de errores
    eventSource.onerror = (event: any) => {
      console.error('❌ SSE Error:', event);
      setIsConnected(false);
      setError('Error en la conexión. Reintentando...');
      options?.onError?.(event);
    };

    // Cleanup al desmontar
    return () => {
      console.log('🔌 Cerrando conexión SSE');
      eventSource.close();
      setIsConnected(false);
    };
  }, [token]);

  return {
    isConnected,
    error,
    disconnect: () => {
      eventSourceRef.current?.close();
      setIsConnected(false);
    },
  };
};
