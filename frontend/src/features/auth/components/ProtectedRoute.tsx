import { Navigate } from "react-router-dom";
import { decodeToken } from "../../../utils/jwtUtils";
import { useAuth } from "../context/useAuth";
import { ProtectedRouteProps } from "../types/AuthTypes";


// ProtectedRoute se encarga de validar las credenciales del usuario, y lo redirige en base a la respuesta
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { token, isAuthenticated } = useAuth();

    if(!isAuthenticated || !token ) {
        return <Navigate to={"/login"} replace/>
    }

    if (requiredRole) {
        const decoded = decodeToken(token);
        if(!decoded || decoded.role !== requiredRole) {
            return <Navigate to="/unauthorized" replace />
        } 
    }
    return children;
};

export default ProtectedRoute;