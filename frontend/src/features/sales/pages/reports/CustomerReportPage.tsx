import { useEffect, useState } from "react";
import BackButton from "../../../../components/BackButton";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { UseCustomerReportHock } from "./SalesHocks/CustomerReportSales";
import SalesCustomerReportTable from "../../components/Reports/CustomerReport/CustomerReportTable";
import { SalesCustomerReportFilter } from "./SalesFilters/CustomerReportFilter";
import GraphCustomerReport from "../../components/Reports/CustomerReport/GraphCustomerReport";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Pagination } from "../../../../components/Pagination";

export default function CustomerReportPage() {
  const pageSize = 10;

  const [page, setPage] = useState(1);
  const [showGraph, setShowGraph] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    minOrders: 0,
  });

  const { data, loading, fetchReport } = UseCustomerReportHock();

  const handleSearch = () => {
    setPage(1);
    fetchReport({
      ...filters,
      page: 1,
      pageSize,
    });
  };

  const handleRefresh = () => {
    fetchReport({
      ...filters,
      page,
      pageSize,
    });
  };

  useEffect(() => {
    fetchReport({
      ...filters,
      page,
      pageSize,
    });
  }, [page]);

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  const items = data?.items ?? [];

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      {/* Back */}
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/reports/dashboard" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Ventas por clientes
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Visualizá todos los pedidos creados por cliente.
        </p>

        {/* Filters */}
        <div className="mb-4">
          <SalesCustomerReportFilter
            filters={filters}
            onChange={(field, value) =>
              setFilters((prev) => ({ ...prev, [field]: value }))
            }
            onSearch={handleSearch}
            onClear={() => {
              setFilters({ name: "", email: "", minOrders: 0 });
              setPage(1);
              fetchReport({ page: 1, pageSize });
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph((prev) => !prev)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            {showGraph ? <EyeOff size={20} /> : <Eye size={20} />}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw size={20} />
            Refrescar Reporte
          </button>
        </div>

        {/* Table */}
        {data && (
          <>
            <SalesCustomerReportTable
              items={data.items}
              total={data.totalCount}
            />

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(data.totalCount / pageSize)}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {showGraph && items.length > 0 && (
          <div className="mt-8">
            <GraphCustomerReport data={items} />
          </div>
        )}

      </div>
    </div>
  );
}
