import React,{useState} from "react";
import { Link } from "react-router-dom";
import { useDailyMissing } from "../DepotHocks/useDailiyMissing";
import DailyMissingTable from "../DepotComponents/DailyMissingTable";
import GraphDailyMissing from "../DepotGraph/GraphDailyMissing";

import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";

//codigo del filtro: 
import DailyMissingFilter from "../DepotFilters/DailyMissingFilter";

const DailyMissingPage : React.FC = () => {
  const [page,setPage] = useState(1);
  const [selectedHour, setSelectedHour] = useState<number | "">("");
  const pageSize = 10;

  const {data,loading,error, totalPages} = useDailyMissing(page,pageSize);

  // Ensure all items have MissingHour for graphing
  const dataWithHour = data.map(d => ({
    ...d,
    MissingHour: typeof d.MissingHour === 'number' ? d.MissingHour : new Date(d.MissingDate).getHours()
  }));

  const filteredData =
    selectedHour === "" ? dataWithHour : dataWithHour.filter((d) => d.MissingHour === Number(selectedHour));

  if(loading) {
    return <LoadingSpinner message="Cargando los datos..." height="h-screen" />;
  }

  return(
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link to="/depot/depotmanager/reports/Dashboard" className="text-red-600 hover:underline pl-10">
          ← Volver atrás
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Faltantes diarios: 
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los productos que no se encontraron en stock al momento del armado de pedidos.
        </p>

        <DailyMissingFilter  selectedHour={selectedHour} onHourChange={setSelectedHour} />

        {error ? (
          <p className="text-red-600 text-center">{error}</p>
        ): (
          <>
          <DailyMissingTable data={filteredData}/>
          {totalPages >1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          )}
          <GraphDailyMissing data={filteredData} />
          </>
        )}
      </div>
    </div>
  )
}

export default DailyMissingPage;