import React from "react";
import { DeliveryIncidentFilters } from "../../../../types/FilterReports/FilterReportsEntity";

interface Props {
  filters: DeliveryIncidentFilters;
  onChange: (newFilters: DeliveryIncidentFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const DeliveryIncidentsFilter: React.FC<Props> = ({
  filters,
  onChange,
  onSearch,
  onClear,
}) => {
  // Maneja SOLO los campos string (fechas)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // No tocar resolved acá
    if (name === "resolved") return;

    onChange({ ...filters, [name]: value });
  };

  // Maneja exclusivamente el filtro resolved
  const handleResolvedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    onChange({
      ...filters,
      resolved:
        value === "" ? undefined : value === "true" ? true : false,
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end justify-around gap-6">
      {/* Fecha inicio */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Fecha inicio
        </label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha fin */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Fecha fin
        </label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Estado */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          ¿Resuelto?
        </label>
        <select
          name="resolved"
          value={
            filters.resolved === undefined
              ? ""
              : filters.resolved
              ? "true"
              : "false"
          }
          onChange={handleResolvedChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={onSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Buscar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};
