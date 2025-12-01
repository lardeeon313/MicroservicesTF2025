import React from "react";

type RangeType = "all" | "quincena" | "mensual" | "trimestral" | "semestral" | "anual";

type Props = {
  salesRange: RangeType;
  setSalesRange: (value: RangeType) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
};

const SalesPerfomanceReportFilter: React.FC<Props> = ({
  salesRange,
  setSalesRange,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 w-full mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de Reporte
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fecha desde */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
  console.log("🟩 Cambiaste Fecha Desde → limpiando rango");
  setDateFrom(e.target.value);
  setSalesRange("all"); // limpiamos antigüedad
}}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>

        {/* Fecha hasta */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Fecha hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
  console.log("🟩 Cambiaste Fecha Hasta → limpiando rango");
  setDateTo(e.target.value);
  setSalesRange("all");
}}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>

        {/* Antigüedad */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-red-700 mb-1">Antigüedad de pedidos</label>
          <select
            value={salesRange}
  onChange={(e) => {
    const newRange = e.target.value as RangeType;

    console.log("🟥 Seleccionaste rango:", newRange, " → limpiando fechas...");

    setSalesRange(newRange);
    setDateFrom(""); // limpiamos fecha inicial
    setDateTo("");   // limpiamos fecha final
  }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          >
            <option value="all">Todo</option>
            <option value="quincena">Última quincena</option>
            <option value="mensual">Último mes</option>
            <option value="trimestral">Último trimestre</option>
            <option value="semestral">Último semestre</option>
            <option value="anual">Último año</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalesPerfomanceReportFilter;
