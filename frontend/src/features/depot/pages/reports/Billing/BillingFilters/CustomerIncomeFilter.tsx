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
    <div className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end  justify-around gap-6">
      {/* Nombre */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Nombre del Cliente:
        </label>
        <input
          type="text"
          placeholder="Ej: Juan Pérez"
          value={filters.customerName}
          onChange={(e) =>
            onChange({ ...filters, customerName: e.target.value })
          }
          className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200 w-52"
        />
      </div>

      {/* Fecha (única) */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Fecha:</label>
        <input
          type="date"
          value={filters.date} // siempre en YYYY-MM-DD
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
          className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200 w-44"
        />
      </div>

      {/* Total del pedido */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Total del Pedido:
        </label>
        <input
          type="number"
          placeholder="Ej: 1500"
          value={filters.totalAmount}
          onChange={(e) =>
            onChange({ ...filters, totalAmount: e.target.value })
          }
          className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-200 w-40"
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onSearch}
          className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg shadow"
        >
          Filtrar
        </button>
        <button
          onClick={onClear}
          className="bg-gray-300 hover:bg-gray-400 transition text-gray-800 px-4 py-2 rounded-lg shadow"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default CustomerIncomeFilter;
