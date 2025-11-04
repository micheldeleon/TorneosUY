// src/private/PrivateRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../context/global.context";

interface Props {
  isPrivate: boolean;
  children: ReactNode;
}

export const PrivateRoute = ({ children, isPrivate }: Props) => {
  const { token } = useGlobalContext();

  const isAuthenticated = Boolean(token);

  // si la ruta es privada y el usuario no está autenticado
  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // si la ruta es pública pero ya está logueado (por ejemplo /login o /signup)
  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
};