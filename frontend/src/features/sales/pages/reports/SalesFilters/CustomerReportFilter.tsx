interface Props {
  filters: {
    name: string;
    email: string;
    minOrders: number;
  };
  onChange: (field: string, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const SalesCustomerReportFilter = ({
  filters,
  onChange,
  onSearch,
  onClear
}: Props) => {
  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de búsqueda
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Buscar por Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            value={filters.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Buscar por Email
          </label>
          <input
            type="text"
            placeholder="Ej: cliente@email.com"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            value={filters.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        {/* Mínimo pedidos */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Buscar por mínima cantidad de pedidos
          </label>
          <input
            type="number"
            placeholder="0"
            min={0}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
            value={filters.minOrders}
            onChange={(e) => onChange("minOrders", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
        <button
          onClick={onSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

