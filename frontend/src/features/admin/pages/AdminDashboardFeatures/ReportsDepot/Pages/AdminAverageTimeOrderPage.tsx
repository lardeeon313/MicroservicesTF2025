import { useState } from "react";
import { useProcessingTimePerOrder } from "../Hocks/useAdminAverageTimeOrder";

import ProcessingTimeFilter from "../Filters/AverageTimeOrderFilter";
import ProcessingTimeTable from "../../../../../depot/pages/reports/Depot/DepotComponents/AverageTimeOrderTable";
import Pagination from "../../../../../depot/depotmanager/components/Pagination";
import BackButton from "../../../../../../components/BackButton";

import AdminGraphAverageTimeOrder from "../Graphs/GraphAverageTimeOrder";

const AdminAverageProcessingTimePage = () => {
  const [showGraph, setShowGraph] = useState(true);
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    oper: null,
    customer: null,
    page: 1,
    pageSize: 10,
  });

  const { data, loading, error } = useProcessingTimePerOrder(filters);
  const [, setRefreshKey] = useState(0);

  const handleSearch = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    // Forzamos actualización incrementando el refreshKey
    setRefreshKey(prev => prev + 1);
    setFilters({ ...filters });
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">

        <BackButton to="/admin/reports/depot" />

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

        {/* Botones de control */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {showGraph ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              )}
            </svg>
            {showGraph ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Actualizando...' : 'Refrescar Reporte'}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 p-8 bg-red-50 rounded-lg border border-red-200">
            <svg className="animate-spin h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-red-600 font-medium">Cargando datos...</p>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-300 mb-6">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {data && <ProcessingTimeTable data={data.items} />}
        
        {/* Espacio entre tabla y gráfico */}
        {data && data.items.length > 0 && showGraph && (
          <div className="mt-10">
            <AdminGraphAverageTimeOrder data={data.items} />
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-4">
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

export default AdminAverageProcessingTimePage;