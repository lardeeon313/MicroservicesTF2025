import { useOrderStatusHistoryReport } from "../VerificationHocks/useOrderByStatusHistory";
import { OrderStatusHistoryFiltersFilter } from "../VerificationFilters/FilterOrderByStatusHistory";
import { OrderStatusHistoryTable } from "../VerificationComponents/OrderByStatusHistoryFolder/OrderByStatusHistoryReport";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../components/BackButton";

export const OrderStatusHistoryReportPage = () => {
  const {
    data,
    filters,
    setFilters,
    loading,
    fetchData,
    pagination,
  } = useOrderStatusHistoryReport();

  
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
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Historial de reportes de pedidos
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Verifica el historial de estados por pedido.
        </p>
      </div>

      
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <OrderStatusHistoryFiltersFilter
          filters={filters}
          setFilters={setFilters}
          fetchData={fetchData} 
        />

        
        {!loading && (
          <div className="space-y-12 mt-8">
            <OrderStatusHistoryTable data={data} />

            
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={pagination.pageNumber === 1}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              <span className="text-gray-700 font-semibold">
                Página {pagination.pageNumber} de {pagination.totalPages || 1}
              </span>

              <button
                onClick={handleNextPage}
                disabled={pagination.pageNumber === pagination.totalPages || pagination.totalPages === 0}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>


           
          </div>
        )}
      </div>
    </div>
  );
};
