import { useState } from "react";
import { RefreshCw, EyeOff, Eye } from "lucide-react";
import { AdminUseOrderStatusHistoryReport } from "../Hocks/AdminUseOrderByStatusHistory";
import { AdminOrderStatusHistoryFiltersFilter } from "../Filters/AdminOrderByStatusHistoryFilter";
import { AdminOrderStatusHistoryTable } from "../Components/OrderByStatusHistoryFolder/AdminOrderByStatusHistoryReport";
import { AdminGraphOrderByStatusHistory } from "../Graphs/AdminGraphOrderByStatusHistory";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const AdminReportOrderStatusHistoryReportPage = () => {
  const {
    data,
    filters,
    setFilters,
    loading,
    fetchData,
    pagination,
  } = AdminUseOrderStatusHistoryReport();

  const [showGraph, setShowGraph] = useState(true);

  const handleNextPage = () => {
    if (pagination.pageNumber < pagination.totalPages) {
      fetchData(pagination.pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.pageNumber > 1) {
      fetchData(pagination.pageNumber - 1);
    }
  };

  const handleRefresh = () => {
    fetchData(pagination.pageNumber);
  };

  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Cargando historial de reportes de pedidos..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/logistics" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Historial de reportes de pedidos
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Verifica el historial de estados por pedido.
        </p>
      </div>

      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <AdminOrderStatusHistoryFiltersFilter
          filters={filters}
          setFilters={setFilters}
          fetchData={fetchData}
        />

        {/* Botones de acción */}
        <div className="flex justify-end items-center space-x-4 mt-6 mb-4">
          <button
            onClick={toggleGraph}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
          >
            {showGraph ? (
              <>
                <EyeOff className="w-5 h-5" />
                <span>Ocultar gráfico</span>
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                <span>Mostrar gráfico</span>
              </>
            )}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            <span>Refrescar reporte</span>
          </button>
        </div>

        {!loading && (
          <div className="space-y-8">

            {/* Tabla */}
            <AdminOrderStatusHistoryTable data={data} />
            
            {/* Paginación mejorada */}
            {pagination.totalPages > 0 && (
              <Pagination
                currentPage={pagination.pageNumber}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}

              <button
                onClick={handleNextPage}
                disabled={
                  pagination.pageNumber === pagination.totalPages ||
                  pagination.totalPages === 0
                }
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
            {/* Gráfico */}
            {showGraph && (
              <div className="animate-fadeIn">
                <AdminGraphOrderByStatusHistory data={data} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};