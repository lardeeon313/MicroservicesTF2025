import React from "react";
import { CalendarClock, Search, XCircle } from "lucide-react";

interface CustomerIncomeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const CustomerIncomeFilter: React.FC<CustomerIncomeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 my-4 w-full max-w-lg">
      {/* Campo fecha inicio */}
      <label className="flex items-center gap-2 w-full border border-gray-300 rounded px-3 py-2">
        <CalendarClock className="w-5 h-5 text-gray-500" />
        <input
          type="datetime-local"
          className="w-full bg-transparent outline-none"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </label>

      {/* Campo fecha fin */}
      <label className="flex items-center gap-2 w-full border border-gray-300 rounded px-3 py-2">
        <CalendarClock className="w-5 h-5 text-gray-500" />
        <input
          type="datetime-local"
          className="w-full bg-transparent outline-none"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </label>

      {/* Botón Buscar */}
      <button
        onClick={onSearch}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        <Search className="w-5 h-5" />
        Buscar
      </button>

      {/* Botón Limpiar */}
      <button
        onClick={onClear}
        className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        <XCircle className="w-5 h-5" />
        Limpiar
      </button>
    </div>
  );
};

export default CustomerIncomeFilter;
