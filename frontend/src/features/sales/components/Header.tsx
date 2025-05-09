import React from "react"
import logo from "../styles/LogoVerona.png"
import user from "../styles/Persona.png"


export const Header: React.FC = () => {

  const UserName = "Encargada de ventas"; //Despues del login tiene que aparecer el nombre
    return (
      <header className="flex items-center justify-between bg-white py-4 shadow w-full">
      <div className="container mx-auto px-6 flex items-center justify-between w-full">
        {/* Logo empresa */}
        <div className="flex items-center space-x-2">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
          <span className="text-lg font-bold text-red-700">Distribuidora Verona</span>
        </div>

        {/* Usuario */}
        <div className="flex items-center space-x-3">
          <img src={user || "/placeholder.svg"} alt="Encargada" className="h-10 w-10 rounded-full border" />
          <div className="text-right">
            <p className="text-sm text-gray-600">¡Hola!,</p>
            <p className="text-sm font-medium text-gray-700">{UserName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;