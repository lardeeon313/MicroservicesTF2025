import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../../utils/jwtUtils";
import { useAuth } from "../context/useAuth";
import { ProtectedRouteProps } from "../types/AuthTypes";


// ProtectedRoute se encarga de validar las credenciales del usuario, y lo redirige en base a la respuesta
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { token, isAuthenticated } = useAuth();

    if(!isAuthenticated || !token ) {
        return <Navigate to={"/login"} replace/>
    }

    if (requiredRole) {
        const role = getRoleFromToken(token);
        if(!role || role !== requiredRole) {
            return <Navigate to="/unauthorized" replace />
        } 
    }
    return children;
};

export default ProtectedRoute;