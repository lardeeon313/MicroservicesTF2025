import React from "react";

type FilterType = "day" | "month" | "quincena" | "";

interface DailyMissingSelectFilterProps {
  filterType: FilterType;
  onFilterTypeChange: (value: FilterType) => void;
  onSearch: () => void;
  onClear: () => void;
}

const DailyMissingSelectFilter: React.FC<DailyMissingSelectFilterProps> = ({
  filterType,
  onFilterTypeChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6 bg-white shadow-md p-4 rounded-xl">

      
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Seleccione una opcion</label>

        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="">Seleccione...</option>
          <option value="day">Hoy</option>
          <option value="month">Este mes</option>
          <option value="quincena">Última quincena</option>
        </select>
      </div>

      
      <div className="flex gap-3 mt-5">
        <button
          onClick={onSearch}
          className="bg-red-500 hover:bg-red-600 transition-colors text-white px-5 py-2 rounded-lg shadow"
        >
          Buscar
        </button>

        <button
          onClick={onClear}
          className="bg-gray-400 hover:bg-gray-500 transition-colors text-white px-5 py-2 rounded-lg shadow"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default DailyMissingSelectFilter;
