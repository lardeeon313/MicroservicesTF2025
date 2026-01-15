import React, { useState } from "react";
import { SatisfactionLabels,CustomerSatisfactionLevel  } from "../../../../admin/pages/AdminDashboardFeatures/ReportsSales/Types/CustomerSatisfactionType";

interface Filters {
  name: string;
  email: string;
  satisfaction: "Todas" | CustomerSatisfactionLevel;
}

interface Props {
  selectedName: string;
  selectedEmail: string;
  selectedSatisfaction: Filters["satisfaction"];
  onSearch: (filters: Filters) => void;
  onClear: () => void;
}

const CustomerSatisfactionFilter: React.FC<Props> = ({
  selectedName,
  selectedEmail,
  selectedSatisfaction,
  onSearch,
  onClear,
}) => {
  const [name, setName] = useState(selectedName);
  const [email, setEmail] = useState(selectedEmail);
  const [satisfaction, setSatisfaction] = useState(selectedSatisfaction);

  const handleClear = () => {
    setName("");
    setEmail("");
    setSatisfaction("Todas");
    onClear();
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de satisfacción del cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="text"
            placeholder="Ej: cliente@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        {/* Satisfacción */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Satisfacción
          </label>
          <select
            value={satisfaction}
            onChange={(e) =>
              setSatisfaction(
                e.target.value === "Todas"
                  ? "Todas"
                  : (Number(e.target.value) as CustomerSatisfactionLevel)
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="Todas">Todas</option>
            {Object.entries(SatisfactionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg
                     hover:bg-gray-300 transition"
        >
          Limpiar
        </button>

        <button
            onClick={() => {
              
              onSearch({ name, email, satisfaction });
            }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg
                     hover:bg-red-700 transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default CustomerSatisfactionFilter;