<<<<<<< HEAD
import React from "react";
import logo from "../styles/LogoVerona.png";
import user from "../styles/Persona.png";

export const Header: React.FC = () => {
  const UserName = "Encargada de ventas";

  return (
    <header className="bg-white shadow-md border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo empresa */}
        <div className="flex items-center space-x-4">
          <img src={logo || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-semibold text-red-700 tracking-wide">
            Distribuidora Verona
          </span>
        </div>

        {/* Línea divisoria sutil */}
        {/*<div className="h-8 border-l border-gray-300 mx-4 hidden sm:block"></div>*/}

        {/* Usuario */}
        <div className="flex items-center gap-3">
          <img
            src={user || "/placeholder.svg"}
            alt="Encargada"
            className="h-10 w-10 rounded-full border border-gray-300 shadow-sm"
          />
          <div className="text-sm text-right">
            <p className="text-gray-500">¡Hola!</p>
            <p className="font-medium text-gray-700">{UserName}</p>
=======
import logoVerona from "../../../assets/logo-verona-circular.png"
import iconUser from "../../../assets/icon-person.png"

export const Header: React.FC = () => {

    const UserName  = "Encargada de Ventas";
    return (
      <header className="flex items-center justify-between bg-white py-4 shadow w-full">
      <div className="container mx-auto px-6 flex items-center justify-between w-full">
        {/* Logo empresa */}
        <div className="flex items-center space-x-2">
          <img src={logoVerona || "/placeholder.svg"} alt="Logo" className="h-10 w-auto" />
          <span className="text-lg font-bold text-red-700">Distribuidora Verona</span>
        </div>

        {/* Usuario */}
        <div className="flex items-center space-x-3">
          <img src={iconUser || "/placeholder.svg"} alt="Encargada" className="h-10 w-10 rounded-full border" />
          <div className="text-right">
            <p className="text-sm text-gray-600">¡Hola!,</p>
            <p className="text-sm font-medium text-gray-700">{UserName}</p>
>>>>>>> origin/feature/milton-microservicestf2025
          </div>
        </div>
      </div>
    </header>
<<<<<<< HEAD
  );
};

export default Header;

=======
    );
}

export default Header;
>>>>>>> origin/feature/milton-microservicestf2025
