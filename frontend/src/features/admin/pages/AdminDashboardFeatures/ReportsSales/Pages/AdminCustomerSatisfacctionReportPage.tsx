import React, { useState } from "react";
import BackButton from "../../../../../../components/BackButton";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import { AdminUseCustomerSatisfactionReport } from "../Hocks/AdminCustomerSatisfacctionHock";
import AdminCustomerSatisfactionFilter from "../Filters/AdminCustomerSatisfaccionFilter";
import { AdminCustomerSatisfactionTable } from "../Components/AdminCustomerSatisfacctionTable";
import { AdminGraphSatisfactionCustomerSatisfaction } from "../Graphs/AdminGraphCustomerSatisfacction";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

const AdminCustomerSatisfactionReportPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showGraph, setShowGraph] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    satisfaction: "Todas" as any,
  });

  const { data, loading, totalPages, refetch } =
    AdminUseCustomerSatisfactionReport(page, pageSize, {
      name: filters.name,
      email: filters.email,
      level: filters.satisfaction,
    });

  if (loading) {
    return <LoadingSpinner message="Cargando..." height="h-screen" />;
  }

  return (
    <div className="container pt-10">
      <BackButton to="/admin/reports/sales" />

      <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
        Satisfacción del cliente
      </h1>

      <p className="text-center text-gray-600 mb-10">
        Visualiza la satisfacción obtenida de los diferentes clientes.
      </p>

      <AdminCustomerSatisfactionFilter
        selectedName={filters.name}
        selectedEmail={filters.email}
        selectedSatisfaction={filters.satisfaction}
        onSearch={(f) => {
          setPage(1);
          setFilters(f);
        }}
        onClear={() => {
          setPage(1);
          setFilters({ name: "", email: "", satisfaction: "Todas" });
        }}
      />

      <div className="flex justify-end gap-2 my-6">
        <button
          onClick={() => setShowGraph(!showGraph)}
          className="btn-primary flex items-center gap-2"
        >
          {showGraph ? <EyeOff size={20} /> : <Eye size={20} />}
          {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
        </button>

        <button onClick={refetch} className="btn-danger flex items-center gap-2">
          <RefreshCw size={20} />
          Refrescar Reporte
        </button>
      </div>

      <AdminCustomerSatisfactionTable data={data?.items ?? []} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {showGraph && data && (
        <div className="mt-8">
          <AdminGraphSatisfactionCustomerSatisfaction data={data.items} />
        </div>
      )}
    </div>
  );
};

export default AdminCustomerSatisfactionReportPage;
