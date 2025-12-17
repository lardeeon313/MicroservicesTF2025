import React from "react";
import { OrdersCompletedFilter } from "../DepotHocks/useOrderCompletedDay";

interface Props {
  filters: OrdersCompletedFilter;  // ← v2: ahora recibe los filtros "draft"
  setFilters: React.Dispatch<React.SetStateAction<OrdersCompletedFilter>>;
  onSearch: () => void;            // ← NUEVO
  onClear: () => void;             // ← NUEVO
}

export const CompletedOrdersFilter: React.FC<Props> = ({
  filters,
  setFilters,
  onSearch,
  onClear,
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      
      {/* Título */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        
        {/* Fecha Desde */}
        <div className="col-span-1 md:col-span-4">
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Fecha Desde
          </label>

          <input
            type="date"
            name="from"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            value={filters.from ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Fecha Hasta */}
        <div className="col-span-1 md:col-span-4">
          <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Fecha Hasta
          </label>

          <input
            type="date"
            name="to"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            value={filters.to ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div className="col-span-1 md:col-span-4 flex gap-3">

          {/* Buscar */}
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow transition-colors duration-200 flex items-center justify-center gap-2"
            onClick={onSearch}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>

          {/* Limpiar */}
          <button
            onClick={onClear}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar
          </button>

        </div>

      </div>
    </div>
  );
};
