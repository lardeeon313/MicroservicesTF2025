import { useOrderStatusHistoryReport } from "../VerificationHocks/useOrderByStatusHistory";
import { OrderStatusHistoryFiltersFilter } from "../VerificationFilters/FilterOrderByStatusHistory";
import { OrderStatusHistoryTable } from "../VerificationComponents/OrderByStatusHistoryFolder/OrderByStatusHistoryReport";
import { GraphOrderStatusHistory } from "../VerificationGraphs/GraphOrderByStatusHistory";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import BackButton from "../../../../../../components/BackButton";
import { OrderByStatusAssigmentReport } from "../VerificationComponents/OrderByStatusHistoryFolder/OrderByStatusAssigmentReport";


export const OrderStatusHistoryReportPage = () => {
  const { data, filters, setFilters, loading, fetchData } =
    useOrderStatusHistoryReport();

  // Mostrar spinner mientras carga
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
      {/* Encabezado */}
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/verification/reports" />
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Historial de reportes de pedidos
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Verifica el historial de estados por pedido.
        </p>
      </div>

      {/* Filtros */}
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <OrderStatusHistoryFiltersFilter
          filters={filters}
          setFilters={setFilters}
          onSearch={fetchData}
        />

        {/* Tabla y gráfico simplificados */}
        {!loading && (
          <div className="space-y-12 mt-8">
            <OrderStatusHistoryTable data={data} />
            <OrderByStatusAssigmentReport data={data} />
            <GraphOrderStatusHistory data={data} />
          </div>
        )}
      </div>
    </div>
  );
};