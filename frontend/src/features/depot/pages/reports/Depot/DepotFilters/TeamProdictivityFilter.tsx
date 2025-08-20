import React from "react";
import { Calendar } from "lucide-react";

type Props = {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
};

const TeamProductivityDateFilter: React.FC<Props> = ({
  from,
  to,
  onFromChange,
  onToChange,
}) => {
  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar className="w-5 h-5 text-blue-500" />
        <h3 className="text-base font-semibold tracking-wide">
          Filtrar por rango de fechas
        </h3>
      </div>

      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-sm font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-sm font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm 
                       focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamProductivityDateFilter;
