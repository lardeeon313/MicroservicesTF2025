import React from "react";

type Props = {
  selectedHour: number | "";
  onHourChange: (value: number | "") => void;
};

const DailyMissingFilter: React.FC<Props> = ({ selectedHour, onHourChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col items-start gap-1 mb-6">
      <label htmlFor="hour-filter" className="text-sm font-medium text-gray-700">
        Filtro por hora del faltante
      </label>
      <select
        id="hour-filter"
        className="w-64 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
        value={selectedHour}
        onChange={(e) =>
          onHourChange(e.target.value === "" ? "" : parseInt(e.target.value))
        }
      >
        <option value="">Todas las horas</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour.toString().padStart(2, "0")}:00 hs
          </option>
        ))}
      </select>
    </div>
  );
};

export default DailyMissingFilter;

