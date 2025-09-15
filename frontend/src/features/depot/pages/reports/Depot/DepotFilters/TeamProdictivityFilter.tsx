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
    <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-16 mb-8 bg-white shadow-md p-4 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-red-500" />
        <h1 className="text-xl font-semibold tracking-wide text-gray-600">
          Filtrar por rango de fechas
        </h1>
      </div>

      {/* Inputs */}
      <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
        <div className="flex flex-col w-full md:w-48">
          <label className="text-sm font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm 
                       focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col w-full md:w-48">
          <label className="text-sm font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm 
                       focus:ring-2 focus:ring-red-400 focus:border-red-400 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamProductivityDateFilter;
