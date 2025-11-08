import React from "react";
import { OrderStatusLabelsReport } from "../../../../types/Report";
import { OrderStatusHistoryFilter } from "../../../../types/FilterReports/FilterReportsEntity";

interface FilterProps {
  filters: OrderStatusHistoryFilter;
  setFilters: React.Dispatch<React.SetStateAction<OrderStatusHistoryFilter>>;
  onSearch: () => void;
}

export const OrderStatusHistoryFiltersFilter: React.FC<FilterProps> = ({
  filters,
  setFilters,
  onSearch,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`🧩 Cambio en filtro: ${name} = ${value}`);
    const finalValue = (name === "oldStatus" || name === "newStatus") ? Number(value) : value;
    setFilters((prev) => ({
      ...prev,
      [name]: finalValue || undefined,
    }));
  };

  const handleClear = () => {
    setFilters({}); // El useEffect en el hook llamará a fetchData
  };

  return (
    <form className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end justify-around gap-6">
      {/* Fecha inicio */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Fecha inicio</label>
        <input
          type="datetime-local"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Fecha fin */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Fecha fin</label>
        <input
          type="datetime-local"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* Estado anterior */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Estado anterior</label>
        <select
          name="oldStatus"
          value={filters.oldStatus || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccionar --</option>
          {Object.entries(OrderStatusLabelsReport).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {/* Nuevo estado */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Nuevo estado</label>
        <select
          name="newStatus"
          value={filters.newStatus || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccionar --</option>
          {Object.entries(OrderStatusLabelsReport).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {/* Botones */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};
