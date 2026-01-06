import React, { useState } from "react";

interface Props {
  filters: any;
  setFilters: (updated: Partial<any>) => void;
  onSearch: () => void;
  onClear: () => void;
}

export const FilterPendingCashVerification: React.FC<Props> = ({
  filters,
  setFilters,
  onSearch,
  onClear,
}) => {
  const [activeButton, setActiveButton] = useState<"search" | "clear" | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ [name]: value }); // Usa el setFilters del padre que ya mergea correctamente
  };

  const handleSearchClick = () => {
    setActiveButton("search");
    onSearch();
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleClearClick = () => {
    setActiveButton("clear");
    onClear();
    setTimeout(() => setActiveButton(null), 300);
  };

  return (
    <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl shadow-sm">
      {/* Fecha inicio */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Fecha inicio
        </label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha fin */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Fecha fin
        </label>
        <input
          type="date"
          name="endDate"
          value={filters.endDate || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={handleSearchClick}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            activeButton === "search"
              ? "bg-red-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Buscar
        </button>
        <button
          onClick={handleClearClick}
          className={`px-4 py-2 rounded-md text-gray-700 font-medium transition-colors ${
            activeButton === "clear"
              ? "bg-gray-300"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};
