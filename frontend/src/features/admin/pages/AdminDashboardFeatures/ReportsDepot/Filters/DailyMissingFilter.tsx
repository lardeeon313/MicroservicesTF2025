import React from "react";

interface DailyMissingFilterProps {
  selectedTime: string;
  onHourChange: (val: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const DailyMissingFilter: React.FC<DailyMissingFilterProps> = ({
  selectedTime,
  onHourChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="flex items-center gap-4 mb-6 bg-white border border-gray-300 p-4 rounded-xl">
      {/* Input de fecha + hora */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">
          Seleccione una fecha 
        </label>

        <input
          type="date"
          value={selectedTime}
          onChange={(e) => onHourChange(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Botones */}
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

export default DailyMissingFilter;