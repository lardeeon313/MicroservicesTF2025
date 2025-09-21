import { Link } from "react-router-dom";
import { getTokenPayload } from "../utils/jwtUtils";
import { useAuth } from "../features/auth/context/useAuth";

const Navbar = () => {
  const { token, logout, isAuthenticated } = useAuth();
  const user = token ? getTokenPayload(token) : null;

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding */}
        <Link to="/" className="font-bold text-lg tracking-wide hover:text-red-500 transition-colors">
          Distribuidora Verona
        </Link>

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="flex flex-col md:flex-row items-center gap-3 text-sm md:text-base">
            <p className="font-extralight">{user.name}</p>
            <p className="text-gray-300">{user.role}</p>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded-md hover:bg-red-700 opacity-90 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
