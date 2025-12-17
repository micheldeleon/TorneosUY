import { useState, useEffect } from "react";

/**
 * Hook para verificar si el usuario actual es organizador
 * @returns boolean - true si el usuario es organizador
 */
export const useIsOrganizer = (): boolean => {
  const [isOrganizer, setIsOrganizer] = useState<boolean>(() => {
    const stored = localStorage.getItem("isOrganizer");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isOrganizer") {
        setIsOrganizer(e.newValue ? JSON.parse(e.newValue) : false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isOrganizer;
};
