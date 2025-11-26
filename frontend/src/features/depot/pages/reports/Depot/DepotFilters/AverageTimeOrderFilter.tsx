import React from "react";

type Props = {
  idFilter: string;
  startDateFilter: string;
  endDateFilter: string;
  onIdChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  minDurationFilter: string;
  maxDurationFilter: string;
  onMinDurationChange: (v: string) => void;
  onMaxDurationChange: (v: string) => void;
};

const AverageTimeOrderFilter: React.FC<Props> = ({
  idFilter,
  startDateFilter,
  endDateFilter,
  onIdChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onClear,
  minDurationFilter,
  maxDurationFilter,
  onMinDurationChange,
  onMaxDurationChange
}) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end  justify-around gap-6">
      {/* Filtro por ID */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Buscar por numero de pedido</label>
        <input
          type="text"
          value={idFilter}
          onChange={(e) => onIdChange(e.target.value)}
          placeholder="Ej: 123"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha Inicio */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Fecha Inicio</label>
        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha Fin */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Fecha Fin</label>
        <input
          type="date"
          value={endDateFilter}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>


      
<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-600 mb-1">Duración mínima (minutos)</label>
  <input
    type="number"
    min="0"
    value={minDurationFilter}
    onChange={(e) => onMinDurationChange(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
  />
</div>


<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-600 mb-1">Duración máxima (minutos)</label>
  <input
    type="number"
    min="0"
    value={maxDurationFilter}
    onChange={(e) => onMaxDurationChange(e.target.value)}
    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
  />
</div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={onSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          Buscar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default AverageTimeOrderFilter;
