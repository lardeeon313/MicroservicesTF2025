import { AuthProvider } from "./features/auth/context/AuthProvider.tsx"
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import OrderSatisfactionPage from "./features/sales/pages/orders/OrderSatisfactionPage.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta especial SIN layout para clientes externos */}
          <Route path="/order-satisfaction" element={<OrderSatisfactionPage />} />
          
          {/* Rutas normales CON layout */}
          <Route path="/*" element={
            <>
              <Navbar/>
              <AppRouter />
              <Footer/>
            </>
          } />
        </Routes>
        <Toaster position="bottom-center" />
      </BrowserRouter>    
    </AuthProvider>
  );
}

export default App;
