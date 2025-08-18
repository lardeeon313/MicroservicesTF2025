import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePerfomanceSalesReport } from "../../hooks/usePerfomanceSalesReport";
import { SalesPerfomanceReportTable } from "../../components/Reports/PerfomanceSalesReport/SalesPerfomanceReportTable";
import { GraphSalesPerfomanceReport } from "../../components/Reports/PerfomanceSalesReport/GraphSalesPerfomanceReport";
import SalesPerfomanceReportFilter from "./SalesFilters/SalesPerfomanceReportFilter";
import { SalesPerfomanceDto } from "../../types/OrderTypes";

export const SalesPerfomanceReportPage = () => {
  const { data, loading } = usePerfomanceSalesReport();

  const [lastOrderDate, setLastOrderDate] = useState("");
  const [salesRange, setSalesRange] = useState("all");
  const [filteredData, setFilteredData] = useState<SalesPerfomanceDto[]>([]);

  // 🔹 Convierte fecha de la BD (puede venir "dd/MM/yyyy" o "yyyy-MM-dd")
  const parseDbDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Caso dd/MM/yyyy
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    }

    // Caso yyyy-MM-dd
    if (dateStr.includes("-")) {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    return null;
  };

  // 🔹 Convierte string yyyy-MM-dd (input date) a Date
  const parseInputDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // 🔹 Normaliza Date → "yyyy-MM-dd"
  const formatDate = (date: Date | null): string | null => {
    if (!date || isNaN(date.getTime())) return null; // evita Invalid Date
    return date.toISOString().split("T")[0];
  };

  const handleSearch = () => {
    if (!data) return;

    const inputDate = parseInputDate(lastOrderDate);

    const result = data.filter((item) => {
    const dbDate = parseDbDate(item.lastOrderDate);
    if (!dbDate) return false;

    // 1️⃣ Comparación normalizada (input vs BD)
    const matchesDate =
      !inputDate || formatDate(dbDate) === formatDate(inputDate);

    // 2️⃣ Filtro por rango
    const now = new Date();
    let matchesRange = true;

    switch (salesRange) {
      case "1w": {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesRange = !!dbDate && dbDate >= oneWeekAgo;
        break;
      }
      case "1m": {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesRange = !!dbDate && dbDate >= oneMonthAgo;
        break;
      }
      case "1y": {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesRange = !!dbDate && dbDate >= oneYearAgo;
        break;
      }
      default:
        matchesRange = true;
    }

    return matchesDate && matchesRange;
  });

  setFilteredData(result);
  };

  // 🔹 Resetear filtros
  const handleClear = () => {
    setLastOrderDate("");
    setSalesRange("all");
    setFilteredData(data || []);
  };

  // 🔹 Cuando cambia data inicial, setear sin filtros
  useEffect(() => {
    if (data) setFilteredData(data);
  }, [data]);

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/sales/reports/dashboard"
          className="text-red-600 hover:underline pl-10"
        >
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

        {/* ✅ Filtro con un solo campo de fecha */}
        <SalesPerfomanceReportFilter
          lastOrderDate={lastOrderDate}
          onLastOrderDateChange={setLastOrderDate}
          selectedRange={salesRange}
          onRangeChange={setSalesRange}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Tabla + Gráfico */}
        <SalesPerfomanceReportTable data={filteredData} loading={loading} />
        <GraphSalesPerfomanceReport data={filteredData} />
      </div>
    </div>
  );
};
