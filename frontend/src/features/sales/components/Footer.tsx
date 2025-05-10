import { FaTruck } from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-red-100 to-white text-center text-gray-600 py-6 mt-10 shadow-inner border-t border-red-200">
            <div className="flex flex-col items-center space-y-2">
                <FaTruck className="text-red-500 text-xl" />
                <p className="text-sm font-medium">
                    © 2025 <span className="font-semibold text-red-600">Distribuidora Verona</span>. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
