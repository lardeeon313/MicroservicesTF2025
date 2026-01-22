// components/AdminCustomerStatusReportFilter.tsx

import { useState } from "react";
import { CustomerStatus } from "../../../../../sales/types/CustomerTypes";

export type CustomerStatusReportFilters = {
  name?: string;
  email?: string;
  status?: CustomerStatus;
};

interface Props {
  onSearch: (filters: CustomerStatusReportFilters) => void;
  onClear?: () => void;
}

export const AdminCustomerStatusReportFilter = ({
  onSearch,
  onClear,
}: Props) => {
  const [filters, setFilters] = useState<{
    name: string;
    email: string;
    status: CustomerStatus | "All";
  }>({
    name: "",
    email: "",
    status: "All",
  });

  const handleChange = (
    field: "name" | "email" | "status",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    onSearch({
      name: filters.name || undefined,
      email: filters.email || undefined,
      status: filters.status === "All" ? undefined : filters.status,
    });
  };

  const handleClear = () => {
    setFilters({
      name: "",
      email: "",
      status: "All",
    });

    if (onClear) onClear();
    onSearch({});
  };

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 w-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Filtros de clientes
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2
                       focus:ring-red-400 focus:outline-none transition shadow-sm"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="text"
            placeholder="Ej: cliente@email.com"
            value={filters.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2
                       focus:ring-red-400 focus:outline-none transition shadow-sm"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2
                       focus:ring-red-400 focus:outline-none transition shadow-sm bg-white"
          >
            <option value="All">Todos</option>
            <option value={CustomerStatus.Active}>Activo</option>
            <option value={CustomerStatus.Inactive}>Inactivo</option>
            <option value={CustomerStatus.Lost}>Perdido</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg
                     hover:bg-gray-300 transition font-medium shadow-sm"
        >
          Limpiar
        </button>

        <button
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg
                     hover:bg-red-700 transition font-medium shadow-sm"
        >
          Buscar
        </button>
      </div>

      {/* Panel informativo */}
      <div className="flex flex-row gap-3 w-full mt-6">
        <div className="flex-1 px-4 py-3 rounded-lg bg-green-100 text-green-800 shadow-sm">
          <div className="text-sm font-semibold">Clientes activos</div>
          <div className="text-xs mt-0.5 leading-tight">
            Son clientes que realizaron pedidos recientemente.
          </div>
        </div>

        <div className="flex-1 px-4 py-3 rounded-lg bg-yellow-100 text-yellow-800 shadow-sm">
          <div className="text-sm font-semibold">Clientes inactivos</div>
          <div className="text-xs mt-0.5 leading-tight">
            Son clientes que no realizaron pedidos recientemente.
          </div>
        </div>

        <div className="flex-1 px-4 py-3 rounded-lg bg-red-100 text-red-800 shadow-sm">
          <div className="text-sm font-semibold">Clientes perdidos</div>
          <div className="text-xs mt-0.5 leading-tight">
            Son clientes que no realizaron pedidos hace más de 3 meses.
          </div>
        </div>
      </div>
    </div>
  );
};
