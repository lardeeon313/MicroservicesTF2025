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
          </div>
        </div>
      </div>
    </header>
    );
}

export default Header;