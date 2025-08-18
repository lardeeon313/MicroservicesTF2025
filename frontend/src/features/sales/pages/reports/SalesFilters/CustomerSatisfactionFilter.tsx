import React, { useState } from "react";

type FilterValues = {
  name: string;
  email: string;
  satisfaction: "Todas" | "Positiva" | "Negativa" | "Neutra";
};

interface Props {
  selectedName: string;
  selectedEmail: string;
  selectedSatisfaction: "Todas" | "Positiva" | "Negativa" | "Neutra";
  onChange: (filters: FilterValues) => void;
  onSearch?: (filters: FilterValues) => void;
  onClear?: () => void;
}

const CustomerSatisfactionFilter: React.FC<Props> = ({
  selectedName,
  selectedEmail,
  selectedSatisfaction,
  onChange,
  onSearch,
  onClear,
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    name: selectedName,
    email: selectedEmail,
    satisfaction: selectedSatisfaction,
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
    const cleared: FilterValues = { name: "", email: "", satisfaction: "Todas" };
    setFilters(cleared);
    onChange(cleared);
    if (onClear) onClear();
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de satisfacción del cliente
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
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
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
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Select satisfacción */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Satisfacción</label>
          <select
            value={filters.satisfaction}
            onChange={(e) => handleChange("satisfaction", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="Todas">Todas</option>
            <option value="Positiva">Positiva</option>
            <option value="Negativa">Negativa</option>
            <option value="Neutra">Neutra</option>
          </select>
        </div>
      </div>

      {/* Botones alineados */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default CustomerSatisfactionFilter;

