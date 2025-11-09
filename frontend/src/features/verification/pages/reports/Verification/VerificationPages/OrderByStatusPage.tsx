import { useEffect } from "react";
import { useOrdersByStatusReport } from "../VerificationHocks/useLogisticOrderByStatus";
import { OrdersByStatusFilters } from "../../../../types/FilterReports/FilterReportsEntity";
import { OrdersByStatusFiltersFilter as Filters } from "../VerificationFilters/FilterOrderByStatus";
import { OrdersByStatusTable } from "../VerificationComponents/OrderByStatusFolder/LogisticOrderByStatusReports";
import { GraphOrdersByStatus } from "../VerificationGraphs/GraphLogisticOrderByStatus";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";

export const OrdersByStatusReportPage = () => {
  const { data, loading, error, fetchReport } = useOrdersByStatusReport();
  const handleFilter = (filters: OrdersByStatusFilters) => fetchReport(filters);

  useEffect(() => {
    fetchReport({} as OrdersByStatusFilters);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Cargando reporte de rechazos de entrega..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Reporte estados por pedido
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Verifica la cantidad de pedidos que hay por estado.
        </p>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Filters onFilter={handleFilter} />
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && (
          <div className="space-y-12 mt-8">
            <OrdersByStatusTable data={data} />
            <GraphOrdersByStatus data={data} />
          </div>
        )}
      </div>
    </div>
  );
};
