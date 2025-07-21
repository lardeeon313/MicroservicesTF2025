import React from "react";
import { Calendar } from "lucide-react"; // Icono importado

type Props = {
  selectedDate: string;
  onDateChange: (value: string) => void;
};

const OrderCompletedDayFilter: React.FC<Props> = ({
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <label
        htmlFor="date-filter"
        className="text-sm font-medium text-gray-700 tracking-wide mb-1"
      >
        Seleccioná una fecha:
      </label>
      <div className="relative w-64">
        <input
          type="date"
          id="date-filter"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm text-gray-800 shadow-sm transition duration-200 ease-in-out focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <Calendar className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default OrderCompletedDayFilter;


