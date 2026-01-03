import { useState } from "react";
import CustomerReportTable from "../../components/Reports/CustomerReport/CustomerReportTable";
import GraphCustomerReport from "../../components/Reports/CustomerReport/GraphCustomerReport";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useCustomerReport } from "../../hooks/useCustomerReport";
import { Pagination } from "../../../../components/Pagination";
import CustomerReportFilter from "./SalesFilters/CustomerReportFilter";
import BackButton from "../../../../components/BackButton";

export default function CustomerReportPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [minOrdersFilter, setMinOrdersFilter] = useState(0);

  // Estado para ocultar/mostrar gráfico
  const [showGraph, setShowGraph] = useState(false);

  const { data: customers, loading, totalPages, refetch } = useCustomerReport(page, pageSize);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(nameFilter.toLowerCase()) &&
      c.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
      c.orderCount >= minOrdersFilter
    );
  });

  const handleRefresh = () => {
    // Refresca el reporte completo
    if (refetch) {
      refetch();
    }
    // También puedes resetear filtros si lo deseas
    // setNameFilter("");
    // setEmailFilter("");
    // setMinOrdersFilter(0);
    // setPage(1);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/reports/dashboard" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Ventas por clientes
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualizá todos los pedidos creados por cliente.
        </p>

        {/* Filtros */}
        <div className="mb-4">
          <CustomerReportFilter
            onFilterChange={({ name, email, minOrders }) => {
              setNameFilter(name);
              setEmailFilter(email);
              setMinOrdersFilter(minOrders);
              setPage(1); 
            }}
          />
        </div>

        {/* Botones alineados a la derecha, debajo de los filtros */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>
          
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Refrescar Reporte
          </button>
        </div>

        <CustomerReportTable data={filteredCustomers} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        {/* Gráfico condicional */}
        {showGraph && (
          <div className="mt-8">
            <GraphCustomerReport data={filteredCustomers} />
          </div>
        )}
      </div>
    </div>
  );
}