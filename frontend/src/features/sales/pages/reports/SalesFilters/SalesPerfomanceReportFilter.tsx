import React from "react";

type RangeType = "all" | "quincena" | "mensual" | "trimestral" | "semestral" | "anual";

type Props = {
  selectedRange: RangeType;
  onChange: (value: RangeType) => void;
};

const SalesPerfomanceReportFilter: React.FC<Props> = ({ selectedRange, onChange }) => {
  return (
    <div className="flex flex-col w-full md:w-1/3">
      <label className="text-sm font-semibold text-red-700 mb-1">🕒 Antigüedad de pedidos</label>
      <select
        value={selectedRange}
        onChange={(e) => onChange(e.target.value as RangeType)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
      >
        <option value="all">Todo</option>
        <option value="quincena">Última quincena</option>
        <option value="mensual">Último mes</option>
        <option value="trimestral">Último trimestre</option>
        <option value="semestral">Último semestre</option>
        <option value="anual">Último año</option>
      </select>
    </div>
  );
};

export default SalesPerfomanceReportFilter;
