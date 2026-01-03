import React from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { DeliveryIncidentFilters } from "../../../../../verification/types/FilterReports/FilterReportsEntity";

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "resolved") return;
    onChange({ ...filters, [name]: value });
  };

  const handleResolvedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    onChange({
      ...filters,
      resolved: value === "" ? undefined : value === "true" ? true : false,
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mb-6 border border-gray-200">

      {/* Título de sección */}
      <div className="flex items-center gap-2 mb-6">
        
        <h2 className="text-lg font-semibold text-gray-800">
          Filtros del reporte de incidentes
        </h2>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-wrap items-end justify-between gap-6">

        {/* Fecha inicio */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Fecha inicio
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Fecha fin */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Fecha fin
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Estado
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
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Todos</option>
            <option value="true">Resueltos</option>
            <option value="false">No resueltos</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onSearch}
            className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition font-medium"
          >
            Buscar
          </button>
          <button
            onClick={onClear}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg shadow-md hover:bg-gray-300 transition font-medium"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Sección descriptiva profesional */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <AiOutlineInfoCircle className="text-gray-600" size={18} />
          Leyenda de estados
        </h3>

        <div className="space-y-2 text-sm">

          <div className="flex items-center gap-2 text-gray-700">
            <AiOutlineCheckCircle size={20} className="text-green-600" />
            <span>El incidente fue resuelto correctamente.</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <AiOutlineCloseCircle size={20} className="text-red-600" />
            <span>El incidente aún no ha sido resuelto.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
