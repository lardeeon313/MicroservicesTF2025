import React from "react";

type Props = {
  lastOrderDate: string;
  onLastOrderDateChange: (value: string) => void;
  selectedRange: string;
  onRangeChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

const SalesPerfomanceReportFilter: React.FC<Props> = ({
  lastOrderDate,
  onLastOrderDateChange,
  selectedRange,
  onRangeChange,
  onSearch,
  onClear,
}) => {
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0]; // Hoy
  const minDate = new Date(today.setFullYear(today.getFullYear() - 1))
    .toISOString()
    .split("T")[0]; // Hace 1 año

  return (
    <div className="w-full bg-gray-100 border border-gray-300 rounded-2xl shadow p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        {/* Última Orden */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-semibold text-gray-800 mb-1">
            Última orden
          </label>
          <input
            type="date"
            value={lastOrderDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => onLastOrderDateChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>

        {/* Antigüedad */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-semibold text-gray-800 mb-1">
            🕒 Antigüedad de pedidos
          </label>
          <select
            value={selectedRange}
            onChange={(e) => onRangeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            <option value="all">Todo</option>
            <option value="1w">Última semana</option>
            <option value="1m">Último mes</option>
            <option value="1y">Último año</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow font-semibold transition w-full md:w-auto"
          >
            Buscar
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow font-semibold transition w-full md:w-auto"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPerfomanceReportFilter;


