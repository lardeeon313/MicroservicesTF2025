import React from "react";
import { DeliveryTimesFilters } from "../VerificationHocks/useDeliveryTimesReport";

interface Props {
  filters: DeliveryTimesFilters;
  setFilters: (f: DeliveryTimesFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const DeliveryTimesFilter: React.FC<Props> = ({ filters, setFilters, onSearch, onClear }) => {
  const update = (field: keyof DeliveryTimesFilters, value: any) => {
    setFilters({ ...filters, [field]: value });
  };

  // Iconos SVG para replicar el diseño visual
  const Icons = {
    Search: () => (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    ),
    Calendar: () => (
      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    ),
    User: () => (
      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    ),
    Building: () => (
      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
    ),
    X: () => (
       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    )
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header del Filtro */}
      <div className="flex items-center mb-6 border-b pb-2 border-gray-100">
        <span className="text-red-700 font-bold flex items-center text-lg">
          <Icons.Search />
          Filtros de Búsqueda
        </span>
      </div>

      {/* Grid de Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Fecha Desde */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
            <Icons.Calendar /> Fecha Desde
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
            value={filters.startDate || ""}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
            <Icons.Calendar /> Fecha Hasta
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
            value={filters.endDate || ""}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </div>

        {/* Operario / Equipo (Usando icono User) */}

        {/* Cliente / Zona (Usando icono Building) */}

      </div>

      {/* Fila Inferior: Checkbox a la izquierda, Botones a la derecha */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-t border-gray-100 pt-4">
        
        {/* Checkboxes */}
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
              checked={filters.onlyOnTime || false}
              onChange={(e) => update("onlyOnTime", e.target.checked)}
            />
            Solo entregados a tiempo
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
              checked={filters.onlyLate || false}
              onChange={(e) => update("onlyLate", e.target.checked)}
            />
            Solo entregados fuera de tiempo
          </label>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={onSearch} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
          >
            <Icons.Search />
            Buscar
          </button>
          <button 
            onClick={onClear} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-2 px-6 rounded transition-colors shadow-sm"
          >
            <Icons.X />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};