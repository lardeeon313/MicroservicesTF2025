import { useInvoicedOrdersByCustomer } from "../BillingHocks/useOrderBilled";
import InvoicedOrdersFilter from "../BillingFilters/OrderBilledFilter";
import InvoicedOrdersTable from "../BillingComponents/OrderBilledTable";
import OrderBilledGraph from "../BillingGraphs/GraphOrderBilled";
import BackButton from "../../../../../../components/BackButton";

export default function InvoicedOrdersPage() {
  const { data, loading, error, fetchOrders } = useInvoicedOrdersByCustomer();

  const handleSearch = (filters: { customerName?: string }) => {
    fetchOrders(filters);
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/reports"></BackButton>
      
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-8">
            Pedidos facturados por cliente
          </h1>
          {/* Filtro */}
          <InvoicedOrdersFilter onSearch={handleSearch} />

          {/* Estado de carga / error */}
          {loading && (
            <p className="text-blue-600 font-medium animate-pulse">Cargando...</p>
          )}
          {error && (
            <p className="text-red-600 font-semibold">Error: {error}</p>
          )}

          {/* Tabla */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <InvoicedOrdersTable data={data} />
          </div>

          {/* Gráfico */}
          <OrderBilledGraph data={data} />
        </div>
      </div>
    </div>
  );
}
