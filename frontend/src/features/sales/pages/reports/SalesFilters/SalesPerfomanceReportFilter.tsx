import React from "react";

type Props = {
  selectedRange: string;
  onChange: (value: string) => void;
};

const SalesPerfomanceReportFilter: React.FC<Props> = ({ selectedRange, onChange }) => {
  return (
    <div className="flex flex-col w-full md:w-1/3">
      <label className="text-sm font-semibold text-red-700 mb-1">🕒 Antigüedad de pedidos</label>
      <select
        value={selectedRange}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
      >
        <option value="all">Todo</option>
        <option value="1y">Último año</option>
        <option value="2y">Últimos 2 años</option>
        <option value="3y">Últimos 3 años</option>
        <option value="5y">Últimos 5 años</option>
      </select>
    </div>
  );
};

export default SalesPerfomanceReportFilter;
