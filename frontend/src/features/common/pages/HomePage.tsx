import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import veronaImage from "../../../assets/logo-verona-circular.png";

const HomePage = () => {
  return (
    <div className="bg-white py-2 sm:py-32 flex justify-center min-h-full">
      <div className="max-w-6xl lg:px-8 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[500px]">
            
            {/* Columna izquierda - Logo y texto */}
            <div className="text-center lg:text-right lg:border-r-2 lg:border-gray-200 px-8 py-12 lg:px-12 lg:py-16 bg-gradient-to-br from-white to-gray-50 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-100 rounded-full translate-y-12 -translate-x-12 opacity-60"></div>
              
              <div className="relative z-10">
                {/* Logo con animación de revelación */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    ease: "easeOut",
                    delay: 0.2
                  }}
                  className="flex items-center justify-center lg:justify-end mb-6"
                >
                  <img 
                    src={veronaImage} 
                    alt="Logo Distribuidora Verona" 
                    className="w-32 h-32 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                  />
                </motion.div>
                
                {/* Badge con animación */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8
                  }}
                  className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-4"
                >
                  <h2 className="text-sm font-semibold text-red-600">Sistema de Gestión de Pedidos</h2>
                </motion.div>
                
                {/* Título con animación */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1, 
                    delay: 1.0
                  }}
                  className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 leading-tight"
                >
                  Distribuidora Verona
                </motion.h1>
                
                {/* Descripción con animación */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 1.2
                  }}
                  className="mt-6 text-lg text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0 lg:ml-auto"
                >
                  Gestiona fácilmente la trazabilidad de los pedidos y optimiza la logística.
                </motion.p>
              </div>
            </div>

            {/* Columna derecha - Botones */}
            <div className="px-8 py-12 lg:px-12 lg:py-16 bg-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.4
                }}
                className="space-y-8"
              >
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-red-200 hover:bg-red-50/20 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-700 text-lg font-medium">Si ya tienes cuenta, inicia sesión</p>
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:bg-red-50 transition-colors">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                  </div>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Iniciar sesión
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-gray-300 hover:bg-gray-100/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-700 text-lg font-medium">Si aún no tienes cuenta, regístrate</p>
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                  </div>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-gray-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Registrarse
                  </Link>
                </motion.div>

              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

