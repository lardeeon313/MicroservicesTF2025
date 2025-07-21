import { useState } from "react";
import { Link } from "react-router-dom";
import { usePerfomanceSalesReport } from "../../hooks/usePerfomanceSalesReport";
import { SalesPerfomanceReportTable } from "../../components/Reports/PerfomanceSalesReport/SalesPerfomanceReportTable";
import { GraphSalesPerfomanceReport } from "../../components/Reports/PerfomanceSalesReport/GraphSalesPerfomanceReport";
import SalesPerfomanceReportFilter from "./SalesFilters/SalesPerfomanceReportFilter";

export const SalesPerfomanceReportPage = () => {
  const {
    data,
    loading,
    salesPersonName,
    setSalesPersonName,
    period,
    setPeriod,
  } = usePerfomanceSalesReport();

  const [salesRange, setSalesRange] = useState("all"); // ✅ nuevo filtro de rango

  const now = new Date();

  // ✅ Aplicar el filtro de antigüedad
  const filteredData = data.filter((item) => {
    const matchesName = item.salespersonName
      .toLowerCase()
      .includes(salesPersonName.toLowerCase());

    const orderDate = new Date(item.lastOrderDate);

    const matchesRange = (() => {
      switch (salesRange) {
        case "1y":
          return orderDate >= new Date(new Date().setFullYear(now.getFullYear() - 1));
        case "2y":
          return orderDate >= new Date(new Date().setFullYear(now.getFullYear() - 2));
        case "3y":
          return orderDate >= new Date(new Date().setFullYear(now.getFullYear() - 3));
        case "5y":
          return orderDate >= new Date(new Date().setFullYear(now.getFullYear() - 5));
        default:
          return true;
      }
    })();

    return matchesName && matchesRange;
  });

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
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

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <input
            type="text"
            placeholder="Filtrar por Nombre del Vendedor"
            className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-red-400 focus:ring-2 ring-red-200"
            value={salesPersonName}
            onChange={(e) => setSalesPersonName(e.target.value)}
          />

          <select
            className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            value={period}
            onChange={(e) => setPeriod(e.target.value as "weekly" | "monthly" | "yearly")}
          >
            <option value="weekly">Última semana</option>
            <option value="monthly">Último mes</option>
            <option value="yearly">Último año</option>
          </select>

          {/* ✅ Filtro por antigüedad */}
          <SalesPerfomanceReportFilter selectedRange={salesRange} onChange={setSalesRange} />
        </div>

        <SalesPerfomanceReportTable data={filteredData} loading={loading} />
        <GraphSalesPerfomanceReport data={filteredData} />
      </div>
    </div>
  );
};
