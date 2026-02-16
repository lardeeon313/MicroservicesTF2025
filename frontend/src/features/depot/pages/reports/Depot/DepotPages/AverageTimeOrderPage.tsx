import { useState } from "react";
import { useProcessingTimePerOrder } from "../DepotHocks/useAverageTimeOrder";

import ProcessingTimeFilter from "../DepotFilters/AverageTimeOrderFilter";
import ProcessingTimeTable from "../DepotComponents/AverageTimeOrderTable";
import Pagination from "../../../../depotmanager/components/Pagination";
import BackButton from "../../../../../../components/BackButton";

const ProcessingTimePage = () => {
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    oper: null,
    customer: null,
    page: 1,
    pageSize: 10,
  });

  const { data, loading, error } = useProcessingTimePerOrder(filters);

  const handleSearch = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">

        <BackButton to="/depot/reports" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Tiempo de Armado por Orden
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Reporte con los tiempos promedio de armado y preparación por cada orden.
          </p>
        </div>

        <div className="mb-8">
          <ProcessingTimeFilter onSearch={handleSearch} />
        </div>

        {loading && <p className="text-red-500">Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {data && <ProcessingTimeTable data={data.items} />}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-4">
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              totalItems={data.totalItems}
              itemsPerPage={filters.pageSize}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProcessingTimePage;