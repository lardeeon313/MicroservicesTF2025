// components/NavbarDropDrownMenu.tsx
import { Link } from "react-router-dom";

interface DropdownMenuProps {
  user: { name: string; role: string };
  logout: () => void;
}

const NavbarDropdownMenuComponent = ({ user, logout }: DropdownMenuProps) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded z-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.role}</p>
      </div>
      <Link to="/sales/orders" className="block px-4 py-2 hover:bg-gray-100">Pedidos</Link>
      <Link to="/sales/reports" className="block px-4 py-2 hover:bg-gray-100">Reportes</Link>
      <Link to="/sales/customers" className="block px-4 py-2 hover:bg-gray-100">Clientes</Link>
      <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100">
        Cerrar sesión
      </button>
    </div>
  );
};

export default NavbarDropdownMenuComponent;
