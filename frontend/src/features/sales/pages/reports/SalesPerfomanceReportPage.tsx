import { Link } from "react-router-dom";
import { usePerfomanceSalesReport } from "../../hooks/usePerfomanceSalesReport";
import { SalesPerfomanceReportTable } from "../../components/Reports/PerfomanceSalesReport/SalesPerfomanceReportTable";
import { GraphSalesPerfomanceReport } from "../../components/Reports/PerfomanceSalesReport/GraphSalesPerfomanceReport";
import SalesPerfomanceReportFilter from "./SalesFilters/SalesPerfomanceReportFilter";

export const SalesPerfomanceReportPage = () => {
  const {
    data,
    loading,
    salesRange,
    setSalesRange,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  } = usePerfomanceSalesReport();

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      {/* Volver atrás */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/sales/reports/dashboard" className="text-red-600 hover:underline pl-10">
          ← Volver atrás
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Rendimiento de Ventas
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Se visualiza el rendimiento de todos los encargados de ventas
        </p>

        {/* 🔹 Filtros (componente separado) */}
        <SalesPerfomanceReportFilter
          salesRange={salesRange}
          setSalesRange={setSalesRange}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

        {/* Tabla y gráfico */}
        <SalesPerfomanceReportTable data={data} loading={loading} />
        <GraphSalesPerfomanceReport data={data} />
      </div>
    </div>
  );
};
