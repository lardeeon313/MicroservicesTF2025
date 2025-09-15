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
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Filtros de Reporte
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fecha desde */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">📅 Fecha desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          />
        </div>

        {/* Fecha hasta */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">📅 Fecha hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          />
        </div>

        {/* Antigüedad */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-red-700 mb-1">🕒 Antigüedad de pedidos</label>
          <select
            value={salesRange}
            onChange={(e) => setSalesRange(e.target.value as RangeType)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
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
