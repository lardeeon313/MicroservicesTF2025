import React from "react";
import { Search } from "lucide-react";

type FilterType = "day" | "month" | "quincena" | "";

interface Props {
  selectedTime: string;
  filterType: FilterType;
  onDateChange: (val: string) => void;
  onFilterTypeChange: (val: FilterType) => void;
  onSearch: () => void;
  onClear: () => void;
}

const DailyMissingUnifiedFilter: React.FC<Props> = ({
  selectedTime,
  filterType,
  onDateChange,
  onFilterTypeChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-red-600" />
        <h3 className="text-sm font-semibold text-gray-700">
          Filtros de Búsqueda
        </h3>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* FECHA */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Seleccionar fecha
            </label>
            <input
              type="date"
              value={selectedTime}
              onChange={(e) => onDateChange(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* FILTRO RÁPIDO */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">
              Filtro rápido
            </label>
            <select
              value={filterType}
              onChange={(e) =>
                onFilterTypeChange(e.target.value as FilterType)
              }
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="">Seleccione...</option>
              <option value="day">Hoy</option>
              <option value="month">Este mes</option>
              <option value="quincena">Última quincena</option>
            </select>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClear}
              className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Limpiar
            </button>

            <button
              onClick={onSearch}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMissingUnifiedFilter;