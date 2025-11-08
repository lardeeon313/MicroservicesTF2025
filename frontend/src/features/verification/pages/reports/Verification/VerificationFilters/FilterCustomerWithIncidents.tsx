import React, { useState } from "react";
import { FilterCustomerWithIncident } from "../../../../types/FilterReports/FilterReportsEntity";

interface FilterProps {
  onFilterChange: (filters: FilterCustomerWithIncident) => void;
  isLoading?: boolean;
}

export const CustomersWithIncidentsFilter: React.FC<FilterProps> = ({
  onFilterChange,
  isLoading = false,
}) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [incidentType] = useState<string>("");

  const handleApply = () => {
    onFilterChange({ startDate, endDate, customerId, incidentType });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setCustomerId("");
    onFilterChange({ startDate: "", endDate: "", customerId: "", incidentType: "" });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl mx-auto border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros del Reporte
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? "Cargando..." : "Buscar"}
        </button>

        <button
          onClick={handleClear}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};
