import React from "react";

type Filters = {
  customerName: string;
  date: string;          // YYYY-MM-DD (valor de <input type="date" />)
  totalAmount?: string;  // string para poder limpiar fácilmente
};

type Props = {
  filters: Filters;
  onChange: (next: Filters) => void;
  onSearch: () => void;
  onClear: () => void;
};

const CustomerIncomeFilter: React.FC<Props> = ({
  filters,
  onChange,
  onSearch,
  onClear,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 w-full">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros del reporte</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Nombre del Cliente:</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={filters.customerName}
            onChange={(e) =>
              onChange({ ...filters, customerName: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>

        {/* Fecha (única) */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Fecha:</label>
          <input
            type="date"
            value={filters.date} // siempre en YYYY-MM-DD
            onChange={(e) => onChange({ ...filters, date: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>

        {/* Total del pedido */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Total del Pedido:</label>
          <input
            type="number"
            placeholder="Ej: 1500"
            value={filters.totalAmount}
            onChange={(e) =>
              onChange({ ...filters, totalAmount: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Filtrar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default CustomerIncomeFilter;
