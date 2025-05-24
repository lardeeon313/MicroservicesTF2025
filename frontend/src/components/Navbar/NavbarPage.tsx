// pages/NavbarPage.tsx
import { useAuth } from "../../features/auth/context/useAuth";
import { decodeToken } from "../../utils/jwtUtils";
import NavbarComponent from "./Navbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Los roles que tenemos definidos hasta ahora: 
const allowedRoles = [
  "encargada de ventas",
  "gerente de administracion",
  "encargado de deposito",
];

// Función auxiliar para verificar si un rol está autorizado
const isRoleAuthorized = (role?: string): boolean => {
  if (!role) return false;
  return allowedRoles.includes(role.toLowerCase());
};

const NavbarPage = () => {
  const { token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const user = token ? decodeToken(token) : null;

  useEffect(() => {
    // Si no está autenticado o el rol no es válido, redirige a /unauthorized
    if (!isAuthenticated || !isRoleAuthorized(user?.role)) {
      logout();

      // Evita redirigir si ya estás en la página de error
      if (window.location.pathname !== "/unauthorized") {
        navigate("/unauthorized");
      }
    }
  }, [isAuthenticated, user, logout, navigate]);

  return (
    <NavbarComponent user={user} isAuthenticated={isAuthenticated} logout={logout} />
  );
};

export default NavbarPage;
