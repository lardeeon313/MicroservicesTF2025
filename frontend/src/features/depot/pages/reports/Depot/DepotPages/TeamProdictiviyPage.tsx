import React,{useState} from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import TeamProdictivityTable from "../DepotComponents/TeamProdictivityTable";
import TeamProdictivityGraph from "../DepotGraph/GraphTeamProdictivity";
import { useTeamProdictivity } from "../DepotHocks/useTeamProdictivity";

const TeamProdictivityPage: React.FC = () => {
  const [page,setPage] = useState<number>(1);
  const pageSize = 10; 
  const [idfilter,setidFilter] = useState("");

  const {data,loading,error,totalpages} = useTeamProdictivity(page,pageSize);

  const GraphData = data.map(item => ({
    teamID: item.teamId,
    completedOrders: item.completedOrders
  }));

  if(loading){
    return <LoadingSpinner message="Cargando los datos...porfavor espere" height="h-screen" />
  }


  return(
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Link to={"/depot"} className="text-blue-600 hover:underline font-medium">
          ← Volver al deposito 
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Producitividad de los equipos de deposito: 
        </h1>
        <h2 className="text-center text-lg text-gray-700 mb-12">
          Aqui podes gestionar que tanto se desempeñaron los equipos asignados
        </h2>


        <div className="flex flex-col md:flex-row mb-4 w-full justify-between">
          <input 
            type="text"
            placeholder="Filtrar por ID de pedido"
            className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 focus:transition-colors focus:duration-500 outline-gray-200"
            value={idfilter}
            onChange={(e) => setidFilter(e.target.value)}
          />
        </div>


        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ): (
          <>
            <TeamProdictivityTable data={data} />
            <TeamProdictivityGraph data={GraphData} />
            <Pagination currentPage={page} totalPages={totalpages} onPageChange={setPage}/>
          </>
          )
        }
      </div>
    </div>
  )
}

export default TeamProdictivityPage;