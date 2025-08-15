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
    <div className="flex items-center gap-4 mb-4">
      <input
        type="time"
        value={selectedTime}
        onChange={(e) => onHourChange(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Buscar
      </button>
      <button
        onClick={onClear}
        className="bg-gray-500 text-white px-4 py-1 rounded"
      >
        Limpiar
      </button>
    </div>
  );
};

export default DailyMissingFilter;





