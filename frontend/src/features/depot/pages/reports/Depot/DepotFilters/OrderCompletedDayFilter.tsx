// ../DepotFilters/OrderCompletedDayFilter.tsx
import React from "react";

type OrderCompletedDayFilterProps = {
  selectedDate: string;
  onDateChange: (value: string) => void;
  onSearch: () => void | Promise<void>;
  onClear: () => void | Promise<void>;
};

const OrderCompletedDayFilter: React.FC<OrderCompletedDayFilterProps> = ({
  selectedDate,
  onDateChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-2">
      {/* Fecha única */}
      <div className="flex flex-col">
        <label
          htmlFor="selected-date"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Fecha:
        </label>
        <input
          type="date"
          id="selected-date"
          value={selectedDate || ""}
          onChange={(e) => onDateChange(e.target.value)}
          className="block w-56 rounded-lg border border-gray-300 px-4 py-2 text-sm"
        />
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
