import React, { useEffect, useState } from "react";

import { useAdminCustomerReport } from "../Hocks/AdminCustomerPaymentReportHock";
import { AdminCustomerReportFilters } from "../Types/CustomerPaymentType";

import AdminCustomerPaymentFilter from "../Filters/AdminCustomerPaymentFilter";
import AdminCustomerPaymentReportTable from "../Components/AdminCustomerPaymentReportTable";
import AdminGraphCustomerPaymenTypeReport from "../Graphs/AdminGraphCustomerPaymentReport";
import { Pagination } from "../../../../../../components/Pagination";
import BackButton from "../../../../../../components/BackButton";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

const AdminCustomerReportPaymentTypePage: React.FC = () => {
  const [filters, setFilters] = useState<AdminCustomerReportFilters>({
    name: "",
    startDate: "",
    endDate: "",
    paymentType: [],
  });

  const {
    data,
    loading,
    page,
    totalPages,
    setPage,
  } = useAdminCustomerReport(filters);

  const [showGraph, setShowGraph] = useState(true);

  /* 🔁 Resetear página cuando cambian filtros */
  useEffect(() => {
    setPage(1);
  }, [filters, setPage]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <LoadingSpinner
        message="Cargando reporte..."
        height="h-screen"
      />
    );
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/sales" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Tipos de pago por cliente
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los diferentes tipos de pago utilizados por cada cliente.
        </p>

        {/* Filtros */}
        <div className="mb-4">
          <AdminCustomerPaymentFilter
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Acciones */}
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

        {/* Tabla */}
        <AdminCustomerPaymentReportTable
          data={data}
          loading={loading}
        />

        {/* Gráfico */}
        {showGraph && (
          <div className="mt-8 animate-fadeIn">
            <AdminGraphCustomerPaymenTypeReport data={data} />
          </div>
        )}

        {/* Paginación */}
        {totalPages > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomerReportPaymentTypePage;
