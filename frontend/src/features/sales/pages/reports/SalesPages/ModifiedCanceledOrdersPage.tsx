import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import type { Order,OrderStatus } from "../../../types/OrderTypes";
import ModifiedCanceledOrdersTable from "../SalesComponents/IndividualComponentsSales/ModifiedCanceledOrdersTable";
import GraphModifiedCanceledOrders from "../SalesGraph/GraphModifiedCanceledOrders";
import API from "../../../../../api/axios";
import Footer from "../../../components/Footer";

const ModifiedCanceledOrdersPage: React.FC = () => {
    const [Orders,setOrders] = useState<Order[]>([]);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // Reemplazar por llamada a backend/API real
        
        const fetchOrders = async () => {
        try {
            const response = await API.get<Order[]>("/orders"); // 👈 usa tu instancia
            setOrders(response.data); // 👈 carga los datos al estado
        } catch (err: any) {
            setError("Error al cargar los pedidos.");
            console.error(err);
        } finally {
        setLoading(false);
        }
    };

      fetchOrders();
    }, []);

    if(loading) return <p className="p-4 text-center">Cargando pedidos, espere un momento...</p>
    //error:
    if(error) return <p className="p-4 text-red-500">{error}</p>

    return(
      <div>
        <Header/>
        <div className="p-4">
            <h2 className="text-2xl font-bold text-blue-800 text-center">
              Reporte: Pedidos cancelados y Modificados 
            </h2>
            <ModifiedCanceledOrdersTable orders={Orders} /> 
            <GraphModifiedCanceledOrders orders={Orders} />
        </div>
        <Footer/>
      </div>
    )
}

export default ModifiedCanceledOrdersPage;