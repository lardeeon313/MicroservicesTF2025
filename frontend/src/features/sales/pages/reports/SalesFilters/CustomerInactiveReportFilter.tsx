import { CustomerStatus } from "../../../types/CustomerTypes";
import { useState } from "react";

type FilterValues = {
  status: CustomerStatus | "All";
  name: string;
  email: string;
};

interface Props {
  selectedStatus: CustomerStatus | "All";
  selectedName: string;
  selectedEmail: string;
  onChange: (filters: FilterValues) => void;
  onSearch?: (filters: FilterValues) => void;
  onClear?: () => void;
}

export default function CustomerInactiveReportFilter({
  selectedStatus,
  selectedName,
  selectedEmail,
  onChange,
  onSearch,
  onClear,
}: Props) {
  const [filters, setFilters] = useState<FilterValues>({
    status: selectedStatus,
    name: selectedName,
    email: selectedEmail,
  });

  const handleChange = (field: keyof FilterValues, value: string) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onChange(updated);
  };

  const handleSearch = () => {
    if (onSearch) onSearch(filters);
  };

  const handleClear = () => {
    const cleared: FilterValues = { status: "All", name: "", email: "" };
    setFilters(cleared);
    onChange(cleared);
    if (onClear) onClear();
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de clientes inactivos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Nombre</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="text"
            placeholder="Ej: cliente@email.com"
            value={filters.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Estado</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          >
            <option value="All">Todos</option>
            <option value={CustomerStatus.Active}>Activo</option>
            <option value={CustomerStatus.Inactive}>Inactivo</option>
            <option value={CustomerStatus.Lost}>Perdido</option>
          </select>
        </div>
      </div>

      {/* Botones alineados a la derecha */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
        <button
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
}
