import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeFilter from "../../../../../depot/pages/reports/Billing/BillingFilters/CustomerIncomeFilter";
import CustomerIncomeTable from "../../../../../depot/pages/reports/Billing/BillingComponents/CustomerIncomeTable";
import CustomerIncomeCustomerDetailTable from "../../../../../depot/pages/reports/Billing/BillingComponents/CustomerIncomeCustomerDetailTable";
import BackButton from "../../../../../../components/BackButton";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle, EyeOff, BarChart3, RefreshCw } from "lucide-react";
import { useCustomerIncome } from "../../../../../depot/pages/reports/Billing/BillingHocks/useCustomerIncome";
import GraphCustomerIncome from "../Graphs/GraphCustomerIncome";

/* =======================
   TIPOS
======================= */
type Filters = {
  customerName: string;
  date: string;
  totalAmount: string;
};

type CustomerIncomeDetailItem = {
  orderNumber: string;
  orderDate: string;
  billingDate: string;
  totalAmount: number;
  customerName: string;
  itemsCount?: number;
};

/* =======================
   COMPONENTE
======================= */
const AdminCustomerIncomePage: React.FC = () => {
  const [showGraph, setShowGraph] = useState(true);
  const [page, setPage] = useState(1);

  const {
    orders,
    filteredByCustomer,
    loading,
    error,
    fetchOrdersByCustomer,
    refetch,
  } = useCustomerIncome();

  const [filters, setFilters] = useState<Filters>({
    customerName: "",
    date: "",
    totalAmount: "",
  });

  const pageSize = 10;

  /* =======================
     HELPERS
  ======================= */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  /* =======================
     FILTROS DETALLE CLIENTE
  ======================= */
  const filteredDetailData = filteredByCustomer.filter((o) => {
    let ok = true;

    if (filters.date) {
      const d = new Date(o.orderDate).toISOString().split("T")[0];
      ok = ok && d === filters.date;
    }

    if (filters.totalAmount) {
      ok = ok && Number(o.totalAmount) === Number(filters.totalAmount);
    }

    return ok;
  });

  const mappedFilteredByCustomer: CustomerIncomeDetailItem[] =
    filteredDetailData
      .filter(item => item.totalAmount > 0)
      .map((item) => ({
        orderNumber: item.depotOrderId?.toString() || "N/A",
        orderDate: item.orderDate ? formatDate(item.orderDate) : "N/A",
        billingDate: item.billingDate
          ? formatDate(item.billingDate)
          : formatDate(item.orderDate),
        totalAmount: item.totalAmount,
        customerName: item.customerName,
        itemsCount: item.items?.length || 0,
      }));

  /* =======================
     ACTIONS
  ======================= */
  const applyFilters = () => {
    setPage(1);
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  };

  const clearFilters = () => {
    setFilters({ customerName: "", date: "", totalAmount: "" });
    fetchOrdersByCustomer("");
    setPage(1);
  };

  const handleRefresh = async () => {
    await refetch();

    if (filters.customerName.trim()) {
      await fetchOrdersByCustomer(filters.customerName);
    }

    setPage(1);
  };

  /* =======================
     FILTRO GENERAL
  ======================= */
  const filteredOrders = orders.filter((o) => {
    let ok = true;

    if (filters.date) {
      const d = new Date(o.orderDate).toISOString().split("T")[0];
      ok = ok && d === filters.date;
    }

    if (filters.totalAmount) {
      ok = ok && Number(o.totalAmount) === Number(filters.totalAmount);
    }

    if (filters.customerName.trim()) {
      ok =
        ok &&
        o.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase());
    }

    return ok;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  }, [filters.customerName, fetchOrdersByCustomer]);

  const graphData = filteredOrders.map(order => ({
    BillingDate: order.billingDate || order.orderDate,
    TotalAmount: order.totalAmount,
  }));

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/billing" />

        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Ingresos por Cliente
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás ver los ingresos generados por los diferentes clientes.
        </p>

        <div className="mb-10">
          <CustomerIncomeFilter
            filters={filters}
            onChange={setFilters}
            onSearch={applyFilters}
            onClear={clearFilters}
          />
        </div>

        {/* CONTROLES */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showGraph ? <EyeOff size={16} /> : <BarChart3 size={16} />}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refrescar Reporte
          </button>
        </div>

        {loading && (
          <div className="flex justify-center p-8">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <EmptyState icon={AlertCircle} title="Error" description={error} />
        )}

        {!loading && !error && (
          <>
            {!filters.customerName.trim() ? (
              filteredOrders.length > 0 ? (
                <>
                  <CustomerIncomeTable data={paginatedOrders} />

                  {showGraph && graphData.length > 0 && (
                    <div className="mt-10">
                      <GraphCustomerIncome data={graphData} />
                    </div>
                  )}

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  )}
                </>
              ) : (
                <EmptyState
                  icon={AlertCircle}
                  title="Sin resultados"
                  description="No se encontraron ingresos con los filtros aplicados."
                />
              )
            ) : mappedFilteredByCustomer.length > 0 ? (
              <>
                <CustomerIncomeCustomerDetailTable
                  data={mappedFilteredByCustomer}
                />

                {showGraph && filteredDetailData.length > 0 && (
                  <div className="mt-10">
                    <GraphCustomerIncome
                      data={filteredDetailData.map(item => ({
                        BillingDate: item.billingDate || item.orderDate,
                        TotalAmount: item.totalAmount,
                      }))}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={AlertCircle}
                title="Sin resultados"
                description="No se encontraron ingresos para el cliente seleccionado."
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCustomerIncomePage;
