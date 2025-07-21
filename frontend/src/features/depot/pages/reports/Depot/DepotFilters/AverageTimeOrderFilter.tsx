import React from "react";
import { Calendar, Search } from "lucide-react"; // Iconos

type Props = {
  idFilter: string;
  startDateFilter: string;
  endDateFilter: string;
  onIdChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

const AverageTimeOrderFilter: React.FC<Props> = ({
  idFilter,
  startDateFilter,
  endDateFilter,
  onIdChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Filtro por ID */}
      <div className="flex flex-col">
        <label htmlFor="idFilter" className="mb-2 text-sm font-semibold text-gray-800">
          ID del Pedido
        </label>
        <div className="relative">
          <input
            id="idFilter"
            type="text"
            placeholder="Ej: 12345"
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
            value={idFilter}
            onChange={(e) => onIdChange(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Fecha de inicio */}
      <div className="flex flex-col">
        <label htmlFor="startDate" className="mb-2 text-sm font-semibold text-gray-800">
          Fecha de inicio de armado
        </label>
        <div className="relative">
          <input
            id="startDate"
            type="date"
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
            value={startDateFilter}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Fecha de fin */}
      <div className="flex flex-col">
        <label htmlFor="endDate" className="mb-2 text-sm font-semibold text-gray-800">
          Fecha de fin de armado
        </label>
        <div className="relative">
          <input
            id="endDate"
            type="date"
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
            value={endDateFilter}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
          <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default AverageTimeOrderFilter;
