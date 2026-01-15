import { useOrderStatusHistoryReport } from "../VerificationHocks/useOrderByStatusHistory";
import { OrderStatusHistoryFiltersFilter } from "../VerificationFilters/FilterOrderByStatusHistory";
import { OrderStatusHistoryTable } from "../VerificationComponents/OrderByStatusHistoryFolder/OrderByStatusHistoryReport";
import { Pagination } from "../../../../../../components/Pagination";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const OrderStatusHistoryReportPage = () => {
  const {
    data,
    filters,
    setFilters,
    loading,
    fetchData,
    pagination,
  } = useOrderStatusHistoryReport();

  const handlePageChange = (page: number) => {
    fetchData(page);
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

            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={pagination.pageNumber}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
