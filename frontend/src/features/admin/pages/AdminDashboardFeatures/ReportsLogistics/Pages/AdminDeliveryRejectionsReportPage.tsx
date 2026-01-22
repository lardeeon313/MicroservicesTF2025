//Pedidos rechazados: 
import React, { useState } from "react";
import { AdminUseDeliveryRejections } from "../Hocks/AdminUseDeliveryRejections";
import AdminDeliveryRejectionsFilter from "../Filters/AdminDeliveryRejectionsFilter";
import AdminDeliveryRejectionsTable from "../Components/DeliveryRejections/AdminDeliveryRejectionsReport";
import AdminGraphDeliveryRejections from "../Graphs/AdminGraphDeliveryRejections";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { RejectionReportFilters } from "../../../../../verification/types/FilterReports/FilterReportsEntity";
import { RefreshCw, ChevronUp, ChevronDown, Eye } from "lucide-react";


export const AdminReportDeliveryRejectionsPage: React.FC = () => {
  const [appliedFilters, setAppliedFilters] = useState<RejectionReportFilters>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [showCharts, setShowCharts] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, pagination, loading, error, fetchData } = AdminUseDeliveryRejections({
    ...appliedFilters,
    pageNumber,
    pageSize,
  });

  const handleFilterChange = (filters: RejectionReportFilters) => {
    setAppliedFilters(filters);
    setPageNumber(1); // Reiniciar al cambiar filtros
  };

  const handleClear = () => {
    setAppliedFilters({});
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    fetchData({ ...appliedFilters, pageNumber: newPage, pageSize });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData({ ...appliedFilters, pageNumber, pageSize });
    } finally {
      // Pequeño delay para mejor UX
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const toggleCharts = () => {
    setShowCharts(!showCharts);
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/logistics" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Asignaciones canceladas
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza todas las asignaciones canceladas por los repartidores, filtra y analiza los resultados.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminDeliveryRejectionsFilter onFilterChange={handleFilterChange} onClear={handleClear} />

        {/* Botones de control */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={toggleCharts}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-lg"
          >
            <Eye className="w-5 h-5" />
            {showCharts ? (
              <>
                Ocultar Gráfico
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Mostrar Gráfico
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Refrescar Reporte'}
          </button>
        </div>

        {error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {loading ? (
          <LoadingSpinner message="Cargando reporte de rechazos..." height="h-screen" />
        ) : (
          <div className="space-y-12 mt-8">
            {/* Tabla principal */}
            <AdminDeliveryRejectionsTable data={data} />
            
            {/* Gráficos con animación de entrada/salida */}
            {showCharts && (
              <div className="animate-fade-in">
                <AdminGraphDeliveryRejections data={data} />
              </div>
            )}

            {/* Paginación */}
            <div className="mt-8">
              <Pagination
                currentPage={pagination.pageNumber}
                totalPages={pagination.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportDeliveryRejectionsPage;