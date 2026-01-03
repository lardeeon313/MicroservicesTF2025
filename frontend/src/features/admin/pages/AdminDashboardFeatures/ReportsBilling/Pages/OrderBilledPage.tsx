import { useInvoicedOrdersByCustomer } from "../../../../../depot/pages/reports/Billing/BillingHocks/useOrderBilled";
import InvoicedOrdersFilter from "../../../../../depot/pages/reports/Billing/BillingFilters/OrderBilledFilter";
import InvoicedOrdersTable from "../../../../../depot/pages/reports/Billing/BillingComponents/OrderBilledTable";
import BackButton from "../../../../../../components/BackButton";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle, Search } from "lucide-react";
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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