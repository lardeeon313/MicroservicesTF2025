import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-white py-2 sm:py-32 flex justify-center min-h-full">
      <div className="max-w-x2 lg:max-w-2xl lg:px-8 grid grid-cols-1 lg:grid-cols-2  items-center">
        
        <div className="text-center  lg:text-right lg:border-r-2 lg:border-gray-400 px-5">
          <h2 className="text-base font-semibold text-red-600">Sistema Gestión de Pedidos</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Distribuidora Verona
          </p>
          <p className="mt-6 text-lg text-gray-700">
            Gestiona fácilmente la trazabilidad de los pedidos y optimiza la logística.
          </p>
        </div>

        <div className="">
          <div className="px-2 py-2 lg:px-4 lg:py-0">
            <p className="text-gray-700 text-lg lg:py-2.5">Si ya tienes cuenta, inicia sesión</p>
                <Link
                  to="/login" 
                  className="p-1 bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-gray-600 transition"
                >
                  Iniciar sesión
                </Link>
          </div>
          <div className="lg:px-4 py-4">
            <p className="text-gray-700 text-lg lg:py-2.5">Si aún no tienes cuenta, regístrate</p>
              <Link
                to="/register"
                className="p-1 bg-gray-600 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-red-700 transition"
              >
                Registrarse
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

