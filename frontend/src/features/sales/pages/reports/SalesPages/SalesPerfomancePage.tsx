import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import type { EmployeeSales } from "../../../types/EmployeeSalesTypes";
import SalesPerfomanceTable from "../SalesComponents/IndividualComponentsSales/SalesPerfomanceTable";
import GraphSalesPerfomance from "../SalesGraph/GraphSalesPerfomance";
import API from "../../../../../api/axios";
import Footer from "../../../components/Footer";

const SalesPerfomancePage:React.FC = () => {
    const [empleados, setEmpleados] = useState<EmployeeSales[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchEmpleados = async () => {
        try {
            const response = await API.get("/empleados"); // Ajustá el endpoint si es diferente
            setEmpleados(response.data);
        } catch (error) {
            console.error("Error al obtener los datos:");
          }
        };

        fetchEmpleados();
    }, []);

    if(loading) return <p className="text-center">Cargando los datos, por favor espere..</p>
    if(error) return <p className="text-red-600">Error al obtener los datos: </p>

    return(
      <div>
        <Header/>
        <div className="p-4"> 
            <h2 className="text-2xl font-bold text-blue-800 text-center">
              Reporte: Desempeño por ventas 
            </h2>
            <SalesPerfomanceTable rows={empleados} />
            <GraphSalesPerfomance data={empleados} />
        </div>
        <Footer/>
      </div>
    )
}

export default SalesPerfomancePage;