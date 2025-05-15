
import Footer from "../components/Footer";
import { CardLink } from "../components/CardLink";

const DashboardPage = () => {
    return (
    
      <div className="bg-gray-50 py-24 sm:py-32 h-full" >
        <div className="mx-auto max-w-2x1 px-6 lg:max-w-7x1 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-red-600">
            Panel de Ventas
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center font-semibold tracking-tight text-balance text-gray-950 sm:text-2xl">
          Todo lo que necesitas para gestionar los pedidos
          </p>
          <CardLink></CardLink>
        </div>
        <Footer/>
      </div>
     );
  }

  export default DashboardPage;
  