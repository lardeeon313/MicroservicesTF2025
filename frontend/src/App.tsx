import { AuthProvider } from "./features/auth/context/AuthProvider.tsx"
import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";
import { BrowserRouter } from "react-router-dom";
import Footer from "./features/sales/components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <AuthProvider>
          <BrowserRouter>
            <Navbar/>
                <AppRouter />
            <Toaster position="bottom-center" />
            <Footer/>
            </BrowserRouter>    
    </AuthProvider>
  );
}

export default App;
