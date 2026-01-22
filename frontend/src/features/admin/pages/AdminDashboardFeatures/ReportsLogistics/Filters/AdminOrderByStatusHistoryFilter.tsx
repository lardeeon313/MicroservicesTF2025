import React from "react";
import { OrderStatusLabels } from "../Hocks/AdminUseOrderByStatusHistory";
import { OrderStatusHistoryFilter } from "../../../../../verification/types/FilterReports/FilterReportsEntity";

interface FilterProps {
  filters: OrderStatusHistoryFilter;
  setFilters: React.Dispatch<React.SetStateAction<OrderStatusHistoryFilter>>;
  fetchData: (pageNumber?: number) => void;
}

export const AdminOrderStatusHistoryFiltersFilter: React.FC<FilterProps> = ({
  filters,
  setFilters,
  fetchData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleClear = () => {
    setFilters({});
    fetchData(1);
  };

  return (
    <form className="p-6 bg-white shadow-md rounded-2xl mb-6 flex flex-wrap items-end gap-6">

      {/* Fecha inicio */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Fecha inicio</label>
        <input
          type="datetime-local"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Fecha fin */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Fecha fin</label>
        <input
          type="datetime-local"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Estado anterior */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Estado anterior</label>
        <select
          name="oldStatus"
          value={filters.oldStatus ?? ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Selecciona el estado anterior...</option>
          {Object.entries(OrderStatusLabels).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>

      {/* Nuevo estado */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Nuevo estado</label>
        <select
          name="newStatus"
          value={filters.newStatus ?? ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Selecciona el nuevo estado...</option>
          {Object.entries(OrderStatusLabels).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-1">
        <button
          type="button"
          onClick={() => fetchData(1)}
          className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition"
        >
          Buscar
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};
