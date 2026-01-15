import { useMemo, useState } from "react";
import BackButton from "../../../../components/BackButton";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { CustomerStatus } from "../../types/CustomerTypes";
import { UseCustomerStatusReport } from "./SalesHocks/CustomerStatusReportSales";
import { CustomerStatusReportFilter } from "./SalesFilters/CustomerInactiveReportFilter";
import { CustomerStatusReportTable } from "../../components/Reports/CustomerInactiveReport/CustomerInactiveTable";
import GraphCustomerStatusReport from "../../components/Reports/CustomerInactiveReport/GraphCustomerInactive";

import { Eye, EyeOff, RefreshCw } from "lucide-react";

export const CustomerStatusReportPage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [showGraph, setShowGraph] = useState(true);

  const [filters, setFilters] = useState<{
    status?: CustomerStatus;
    name?: string;
    email?: string;
  }>({});

  const requestParams = useMemo(
    () => ({
      page,
      pageSize,
      ...filters,
    }),
    [page, pageSize, filters]
  );

  const {
    data,
    loading,
    error,
    refetch, 
  } = UseCustomerStatusReport(requestParams);

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
    refetch(); 
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();  
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      {/* Back */}
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/reports/dashboard" />
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Estado de los clientes
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar cómo se encuentra el estado del cliente con respecto a sus pedidos.
        </p>

        {/* Filtros */}
        <div className="mb-4">
          <CustomerStatusReportFilter onSearch={handleSearch} />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
          >
            {showGraph ? <EyeOff size={20} /> : <Eye size={20} />}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition"
          >
            <RefreshCw size={20} />
            Refrescar Reporte
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <LoadingSpinner message="Cargando..." height="h-64" />
        )}

        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {/* Tabla + Paginado + Gráfico */}
        {data && !loading && (
          <>
            <CustomerStatusReportTable data={data.items} />

            <Pagination
              currentPage={page}
              totalPages={Math.ceil(data.totalCount / pageSize)}
              onPageChange={setPage}
            />

            {showGraph && (
              <div className="mt-8">
                <GraphCustomerStatusReport customers={data.items} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
