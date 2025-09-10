import { useInvoicedOrdersByCustomer } from "../BillingHocks/useOrderBilled";
import InvoicedOrdersFilter from "../BillingFilters/OrderBilledFilter";
import InvoicedOrdersTable from "../BillingComponents/OrderBilledTable";
import OrderBilledGraph from "../BillingGraphs/GraphOrderBilled";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function InvoicedOrdersPage() {
  const { data, loading, error, fetchOrders } = useInvoicedOrdersByCustomer();
  const navigate = useNavigate();

  const handleSearch = (filters: { customerName?: string }) => {
    fetchOrders(filters);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado con botón volver */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-600">
          Pedidos facturados por cliente
        </h1>
        <button
          onClick={() => navigate("/depot/billingmanager/reports")}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg shadow transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

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
  );
}
