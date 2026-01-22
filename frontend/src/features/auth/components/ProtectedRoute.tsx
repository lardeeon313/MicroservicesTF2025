import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/jwtUtils";
import { useAuth } from "../context/useAuth";
import { ProtectedRouteProps } from "../types/AuthTypes";

// ProtectedRoute valida autenticación y autorización por roles
const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { token, isAuthenticated } = useAuth();

  // 1️⃣ No autenticado
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Autorización por roles (si aplica)
  if (requiredRoles && requiredRoles.length > 0) {
    const role = getRoleFromToken(token);

    const hasAccess = role && requiredRoles.includes(role);

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 3️⃣ Autorizado
  return children;
};

export default ProtectedRoute;
