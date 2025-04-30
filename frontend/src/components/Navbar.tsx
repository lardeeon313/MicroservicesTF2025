import { decodeToken } from "../utils/jwtUtils";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";

const Navbar = () => {
  const { token, logout, isAuthenticated } = useAuth();
  const user = token ? decodeToken(token) : null;

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div>
        <Link to="/" className="font-bold text-lg">
          Distribuidora Verona
        </Link>
      </div>

      {isAuthenticated && user && (
        <div className="flex gap-4 items-center">
          <p>{user.name}</p>
          <p className="text-sm text-gray-300">{user.role}</p>
          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
