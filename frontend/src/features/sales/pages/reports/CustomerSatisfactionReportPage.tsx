import React, { useState } from "react";;
import BackButton from "../../../../components/BackButton";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { UseCustomerSatisfactionReport } from "./SalesHocks/CustomerSatisfactionReportHock";
import CustomerSatisfactionFilter from "./SalesFilters/CustomerSatisfactionFilter";
import { SalesCustomerSatisfactionTable } from "../../components/Reports/CustomerSatisfactionReport/CustomerSatisfactionTable";
import { GraphSatisfactionCustomerSatisfaction } from "../../components/Reports/CustomerSatisfactionReport/GraphCustomerSatisfaction";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { CustomerSatisfactionLevel } from "../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerSatisfactionType";

type SatisfactionFilter = "Todas" | CustomerSatisfactionLevel;

const CustomerSatisfactionReportPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showGraph, setShowGraph] = useState(true);

  const [filters, setFilters] = useState<{
    name: string;
    email: string;
    satisfaction: SatisfactionFilter;
  }>({
    name: "",
    email: "",
    satisfaction: "Todas",
  });

  const { data, loading, totalPages, refetch } =
    UseCustomerSatisfactionReport(page, pageSize, {
      name: filters.name,
      email: filters.email,
      satisfaction:
        filters.satisfaction === "Todas"
          ? undefined
          : filters.satisfaction,
    });

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
          Satisfacción del cliente
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12">
          Visualiza la satisfacción obtenida de los diferentes clientes.
        </p>

        <div className="mb-4">
          <CustomerSatisfactionFilter
            selectedName={filters.name}
            selectedEmail={filters.email}
            selectedSatisfaction={filters.satisfaction}
            onSearch={(f) => {
              setPage(1);
              setFilters(f);
            }}
            onClear={() => {
              setPage(1);
              setFilters({
                name: "",
                email: "",
                satisfaction: "Todas",
              });
            }}
          />
        </div>

        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph((prev) => !prev)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2"
          >
            {showGraph ? <EyeOff size={18} /> : <Eye size={18} />}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={refetch}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refrescar Reporte
          </button>
        </div>

        <SalesCustomerSatisfactionTable data={data?.items ?? []} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {showGraph && data && (
          <div className="mt-8">
            <GraphSatisfactionCustomerSatisfaction data={data.items} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSatisfactionReportPage;
