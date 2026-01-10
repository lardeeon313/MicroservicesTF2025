import { useInvoicedOrdersByCustomer } from "../../../../../depot/pages/reports/Billing/BillingHocks/useOrderBilled";
import InvoicedOrdersFilter from "../../../../../depot/pages/reports/Billing/BillingFilters/OrderBilledFilter";
import InvoicedOrdersTable from "../../../../../depot/pages/reports/Billing/BillingComponents/OrderBilledTable";
import BackButton from "../../../../../../components/BackButton";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle, Search,EyeOff, BarChart3, RefreshCw } from "lucide-react";
import { useState } from "react";
import Pagination from "../../../../../depot/depotmanager/components/Pagination";
import AdminOrderBilledGraph from "../Graphs/GraphOrderBilled";

export default function AdminInvoiceOrdersBilled() {
  const [showGraph, setShowGraph] = useState(true);
  const [, setRefreshKey] = useState(0);
  
  const { data, loading, error, fetchOrders } = useInvoicedOrdersByCustomer();

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const [filters, setFilters] = useState({
    customerName: "",
    minAmount: undefined as number | undefined,
    maxAmount: undefined as number | undefined,
    period: undefined as "day" | "week" | "month" | "fortnight" | undefined,
  });

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const handleSearch = (newFilters: {
    customerName?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
    period?: "day" | "week" | "month" | "fortnight";
  }) => {
    setFilters({
      customerName: newFilters.customerName || "",
      minAmount: newFilters.minAmount,
      maxAmount: newFilters.maxAmount,
      period: newFilters.period,
    });

    if (newFilters.fromDate !== undefined) setFromDate(newFilters.fromDate);
    if (newFilters.toDate !== undefined) setToDate(newFilters.toDate);

    fetchOrders({
      customerName: newFilters.customerName || "",
      fromDate: newFilters.fromDate || "",
      toDate: newFilters.toDate || "",
      minAmount: newFilters.minAmount,
      maxAmount: newFilters.maxAmount,
      period: newFilters.period,
    });

    setPage(1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchOrders({
      customerName: filters.customerName,
      fromDate: fromDate,
      toDate: toDate,
      minAmount: filters.minAmount,
      maxAmount: filters.maxAmount,
      period: filters.period,
    });
  };

  const filteredData = data.filter(item => {
    let pass = true;

    if (filters.customerName.trim() !== "") {
      pass = item.customerName
        .toLowerCase()
        .includes(filters.customerName.trim().toLowerCase());
    }

    if (pass && fromDate) {
      pass = new Date(item.orderDate) >= new Date(fromDate);
    }

    if (pass && toDate) {
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      pass = new Date(item.orderDate) < endDate;
    }

    if (pass && filters.minAmount !== undefined) {
      pass = item.totalAmount >= filters.minAmount;
    }

    if (pass && filters.maxAmount !== undefined) {
      pass = item.totalAmount <= filters.maxAmount;
    }

    if (pass && filters.period) {
      const orderDate = new Date(item.orderDate);
      const now = new Date();
      const diff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (filters.period) {
        case "day":
          pass = diff <= 1;
          break;
        case "week":
          pass = diff <= 7;
          break;
        case "fortnight":
          pass = diff <= 14;
          break;
        case "month":
          pass = diff <= 30;
          break;
      }
    }

    return pass;
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/billing" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Cantidad de pedidos facturados
          </h1>

          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí podrás ver los pedidos facturados agrupados por cliente.
          </p>

          <div className="flex flex-col md:flex-row mb-6 w-full justify-between gap-2">
            <InvoicedOrdersFilter onSearch={handleSearch} />
          </div>

          {/* Botones de control */}
<div className="flex justify-end gap-3 mb-6">
  <button
    onClick={() => setShowGraph(!showGraph)}
    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
  >
    {showGraph ? (
      <>
        <EyeOff className="w-4 h-4" />
        Ocultar Gráfico
      </>
    ) : (
      <>
        <BarChart3 className="w-4 h-4" />
        Mostrar Gráfico
      </>
    )}
  </button>

  <button
    onClick={handleRefresh}
    disabled={loading}
    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
    Refrescar Reporte
  </button>
</div>

          <div className="mt-12">
            {loading && (
              <div className="flex items-center justify-center gap-3 p-8 bg-red-50 rounded-lg border border-red-200 mb-6">
                <LoadingSpinner message="Cargando pedidos facturados..." height="h-32" />
                <p className="text-red-600 font-medium">Cargando datos...</p>
              </div>
            )}

            {error && (
              <div className="mb-6">
                <EmptyState
                  icon={AlertCircle}
                  title="Ha habido un problema"
                  description="Se ha detectado un problema al cargar los pedidos facturados."
                />
              </div>
            )}

            {!loading && !error && filteredData.length > 0 && (
              <>
                <InvoicedOrdersTable data={paginatedData} />

                {/* Gráfico con espacio superior */}
                {showGraph && filteredData.length > 0 && (
                  <div className="mt-10">
                    <AdminOrderBilledGraph data={filteredData} />
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      totalItems={totalItems}
                      itemsPerPage={pageSize}
                    />
                  </div>
                )}
              </>
            )}

            {!loading && !error && filteredData.length === 0 && (
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description="No se encontraron pedidos. Prueba con otro nombre, fecha o monto."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}