
import React,{useState} from "react";
import { Link } from "react-router-dom";
import { useAverageTimeOrder } from "../DepotHocks/useAverageTimeOrder";

import GraphAverageTimeOrder from "../DepotGraph/GraphAverageTimeOrder";
import AverageTimeOrderTable from "../DepotComponents/AverageTimeOrderTable";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";


const AverageTimeOrderPage: React.FC = () => {
  const[page,setPage] = useState(1);

  const pageSize = 10;

  const [idFilter,setIdFilter] = useState("");
  const {data: orders, loading,totalPages} = useAverageTimeOrder(page,pageSize); 

  const filterOrders = orders.filter((order) => 
    order.id.toString().includes(idFilter)
  );

  if(loading) return <LoadingSpinner message="Cargando datos..." height="h-screen" />;

  return(
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/depot/depotmanager/reports/AverageTimerOrder" className="text-red-600 hover:underline pl-10">
         ← Volver atrás
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Tiempo promedio para el armado del pedido:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
           Aquí podrás visualizar cuánto tiempo lleva armar los pedidos realizados por los clientes.
        </p>

        <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
          <input
            type="text"
            placeholder="Filtrar por ID de pedido"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
          />
        </div>
        
        <AverageTimeOrderTable armTime={filterOrders} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        <GraphAverageTimeOrder data={filterOrders} />
      </div>
    </div>
  )

}

export default AverageTimeOrderPage;