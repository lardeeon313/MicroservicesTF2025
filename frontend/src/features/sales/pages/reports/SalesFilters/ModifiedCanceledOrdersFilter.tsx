import React from "react";

type Props = {
  fromDate: string;
  toDate: string;
  statusFilter: "Todos" | "Canceled" | "Issued" | "Pending";
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onStatusFilterChange: (status: "Todos" | "Canceled" | "Issued" | "Pending") => void;
};

const ModifiedCanceledOrdersFilter: React.FC<Props> = ({
  fromDate,
  toDate,
  statusFilter,
  onFromDateChange,
  onToDateChange,
  onStatusFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-6 bg-red-50/30 p-4 rounded-xl shadow-sm border border-red-200">
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-sm font-semibold text-red-700 mb-1">📅 Fecha desde</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
        />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-sm font-semibold text-red-700 mb-1">📅 Fecha hasta</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
        />
      </div>

      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-sm font-semibold text-red-700 mb-1">📌 Estado del pedido</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as any)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
        >
          <option value="Todos">Todos</option>
          <option value="Canceled">Cancelado</option>
          <option value="Issued">Emitido</option>
          <option value="Pending">Pendiente</option>
        </select>
      </div>
    </div>
  );
};

export default ModifiedCanceledOrdersFilter;


