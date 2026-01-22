import { useState } from "react";
import { AdminUsePerfomanceSalesReport } from "../Hocks/AdminSalesStaffPerfomanceHock";
import { AdminSalesStaffPerfomanceTable } from "../Components/AdminSalesStaffPerfomanceTable";
import { AdminGraphSalesStaffPerfomance } from "../Graphs/AdminGraphSalesStaffPerfomance";
import AdminSalesPerfomanceReportFilter from "../Filters/AdminSalesStaffPerfomanceFilter";
import BackButton from "../../../../../../components/BackButton";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

export const AdminSalesStaffPerfomancePage = () => {
  const {
    data,
    filteredData,
    loading,
    salesRange,
    setSalesRange,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    fetchReport,
    clearFilters,
  } = AdminUsePerfomanceSalesReport();

  const [showGraph, setShowGraph] = useState(true);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/admin/reports/sales" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Desempeño de ventas
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12">
          Se visualiza el rendimiento de todos los usuarios con el rol de encargado de ventas
        </p>

        {/* Filtros */}
        <div className="mb-4">
          <AdminSalesPerfomanceReportFilter
            salesRange={salesRange}
            setSalesRange={setSalesRange}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            onSearch={fetchReport}
            onClear={clearFilters}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2"
          >
            {showGraph ? <EyeOff size={20} /> : <Eye size={20} />}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
          >
            <RefreshCw size={20} />
            Refrescar Reporte
          </button>
        </div>

        {/* Tabla */}
        <AdminSalesStaffPerfomanceTable data={filteredData} loading={loading} />

        {/* Gráfico */}
        {showGraph && (
          <div className="mt-10">
            <AdminGraphSalesStaffPerfomance data={data} />
          </div>
        )}
      </div>
    </div>
  );
};
