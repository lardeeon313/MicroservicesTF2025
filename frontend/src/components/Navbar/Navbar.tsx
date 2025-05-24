// components/NavbarComponent.tsx
import { Link } from "react-router-dom";
import logo_verona_circular from "../../assets/logo-verona-circular.png";
import { useState } from "react";
import NavbarDropdownMenuComponent from "./NavbarDropDrownMenu";

interface NavbarProps {
  user: { name: string; role: string } | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const NavbarComponent = ({ user, isAuthenticated, logout }: NavbarProps) => {
  const[isOpen , setIsOpen] = useState(false);


  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center relative">
      <div className="flex items-center gap-3">
        <img src={logo_verona_circular} className="w-10 h-10" />
        <Link to="/" className="font-bold text-lg text-white">
          Distribuidora Verona
        </Link>
      </div>

      {isAuthenticated && user && (
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {/* Icono hamburguesa */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {isOpen && <NavbarDropdownMenuComponent user={user} logout={logout} />}
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;
