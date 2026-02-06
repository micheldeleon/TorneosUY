// src/private/PrivateRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../context/global.context";
import { decodeJWT } from "../../services/utilities/jwt.utility";

interface Props {
  isPrivate: boolean;
  children: ReactNode;
  requiredRole?: string | string[];
}

export const PrivateRoute = ({ children, isPrivate, requiredRole }: Props) => {
  const { token } = useGlobalContext();

  const isAuthenticated = Boolean(token);
  const roles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
      ? [requiredRole]
      : [];

  const decoded = token ? decodeJWT<{ authorities?: string[] }>(token) : null;
  const hasRequiredRole = roles.length === 0 || roles.some((role) => decoded?.authorities?.includes(role));

  // si la ruta es privada y el usuario no está autenticado
  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // si la ruta requiere rol y no lo tiene
  if (isPrivate && isAuthenticated && roles.length > 0 && !hasRequiredRole) {
    return <Navigate to="/perfil" replace />;
  }

  // si la ruta es pública pero ya está logueado (por ejemplo /login o /signup)
  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
};