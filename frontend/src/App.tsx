import { AuthProvider } from "./features/auth/context/AuthProvider.tsx"
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import AppRouter from "./router/AppRouter";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
          <BrowserRouter>
            <Navbar />
                <AppRouter />
            <Toaster position="bottom-center" />
            </BrowserRouter>    
    </AuthProvider>
  );
}

export default App;
