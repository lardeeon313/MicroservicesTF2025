import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import CustomerIncomeFilter from "../../../../../depot/pages/reports/Billing/BillingFilters/CustomerIncomeFilter";
import CustomerIncomeTable from "../../../../../depot/pages/reports/Billing/BillingComponents/CustomerIncomeTable";
import CustomerIncomeCustomerDetailTable from "../../../../../depot/pages/reports/Billing/BillingComponents/CustomerIncomeCustomerDetailTable";
import BackButton from "../../../../../../components/BackButton";
import EmptyState from "../../../../../../components/EmptyState";
import { AlertCircle } from "lucide-react";
import { useCustomerIncome } from "../../../../../depot/pages/reports/Billing/BillingHocks/useCustomerIncome";
import GraphCustomerIncome from "../Graphs/GraphCustomerIncome";

// Define el tipo para los filtros
type Filters = {
  customerName: string;
  date: string;
  totalAmount: string;
};

// Define el tipo para los elementos de la tabla detallada
type CustomerIncomeDetailItem = {
  orderNumber: string;
  orderDate: string;
  billingDate: string;
  totalAmount: number;
  customerName: string;
  itemsCount?: number;
};

const AdminCustomerIncomePage: React.FC = () => {
  const [showGraph, setShowGraph] = useState(true);
  const [, setRefreshKey] = useState(0);
  
  const {
    orders,
    filteredByCustomer,
    loading,
    error,
    fetchOrdersByCustomer,
  } = useCustomerIncome();

  const [filters, setFilters] = useState<Filters>({
    customerName: "",
    date: "",
    totalAmount: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "N/A";
    }
  };

  // Aplicar filtros a los datos detallados del cliente
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

  // Mapea los datos de `filteredDetailData` al tipo `CustomerIncomeDetailItem`
  const mappedFilteredByCustomer: CustomerIncomeDetailItem[] = filteredDetailData
    .filter(item => item.totalAmount > 0)
    .map((item) => ({
      orderNumber: item.depotOrderId?.toString() || "N/A",
      orderDate: item.orderDate ? formatDate(item.orderDate) : "N/A",
      billingDate: item.billingDate ? formatDate(item.billingDate) : formatDate(item.orderDate),
      totalAmount: item.totalAmount,
      customerName: item.customerName,
      itemsCount: item.items?.length || 0,
      Status: item.Status
    }));

  // Aplica los filtros
  const applyFilters = () => {
    setPage(1);
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  };

  // Limpia los filtros
  const clearFilters = () => {
    setFilters({ customerName: "", date: "", totalAmount: "" });
    fetchOrdersByCustomer("");
    setPage(1);
  };

  // Refrescar reporte
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  };

  // Filtra las órdenes según los filtros aplicados
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
      ok = ok && o.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
    }
    return ok;
  });

  // Calcula el número total de páginas
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // Obtiene las órdenes paginadas
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Efecto para buscar órdenes por cliente cuando se aplica el filtro
  useEffect(() => {
    if (filters.customerName.trim()) {
      fetchOrdersByCustomer(filters.customerName);
    }
  }, [filters.customerName, fetchOrdersByCustomer]);

  // Preparar datos para el gráfico
  const graphData = filteredOrders.map(order => ({
    BillingDate: order.billingDate || order.orderDate,
    TotalAmount: order.totalAmount
  }));

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

        <>
          {loading && (
            <div className="flex items-center justify-center gap-3 p-8 bg-red-50 rounded-lg border border-red-200 mb-6">
              <LoadingSpinner />
              <p className="text-red-600 font-medium">Cargando datos...</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6">
              <EmptyState icon={AlertCircle} title="Error" description={error} />
            </div>
          )}
          
          {!loading && !error && (
            <div>
              {!filters.customerName.trim() ? (
                <>
                  {filteredOrders.length > 0 ? (
                    <>
                      <CustomerIncomeTable data={paginatedOrders} />
                      
                      {/* Gráfico con espacio superior */}
                      {showGraph && graphData.length > 0 && (
                        <div className="mt-10">
                          <GraphCustomerIncome data={graphData} />
                        </div>
                      )}
                      
                      {totalPages > 1 && (
                        <div className="mt-8">
                          <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState
                      icon={AlertCircle}
                      title="Sin resultados"
                      description="No se encontraron ingresos con los filtros aplicados."
                    />
                  )}
                </>
              ) : (
                <>
                  {mappedFilteredByCustomer.length > 0 ? (
                    <>
                      <CustomerIncomeCustomerDetailTable data={mappedFilteredByCustomer} />
                      
                      {/* Gráfico para vista detallada por cliente */}
                      {showGraph && filteredDetailData.length > 0 && (
                        <div className="mt-10">
                          <GraphCustomerIncome 
                            data={filteredDetailData.map(item => ({
                              BillingDate: item.billingDate || item.orderDate,
                              TotalAmount: item.totalAmount
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
          )}
        </>
      </div>
    </div>
  );
};

export default AdminCustomerIncomePage;