import React from "react";
import { Calendar } from "lucide-react";

type Props = {
  selectedDate: string;
  onDateChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

const OrderCompletedDayFilter: React.FC<Props> = ({
  selectedDate,
  onDateChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-2">
      <div className="flex flex-col">
        <label htmlFor="date-filter" className="text-sm font-medium text-gray-700 mb-1">
          Seleccioná una fecha:
        </label>
        <div className="relative w-56">
          <input
            type="date"
            id="date-filter"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-800 shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 mt-6 sm:mt-0">
        <button
          onClick={onSearch}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition"
        >
          Buscar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm shadow-sm transition"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default OrderCompletedDayFilter;



