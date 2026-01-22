import React, { useState } from "react";

interface AdminCustomerSatisfactionFilter {
  name: string;
  email: string;
  satisfaction: "Todas" | "Positiva" | "Negativa" | "Neutra";
}

interface Props {
  selectedName: string;
  selectedEmail: string;
  selectedSatisfaction: AdminCustomerSatisfactionFilter["satisfaction"];
  onSearch: (filters: AdminCustomerSatisfactionFilter) => void;
  onClear: () => void;
}

const AdminCustomerSatisfactionFilter: React.FC<Props> = ({
  selectedName,
  selectedEmail,
  selectedSatisfaction,
  onSearch,
  onClear,
}) => {
  const [name, setName] = useState(selectedName);
  const [email, setEmail] = useState(selectedEmail);
  const [satisfaction, setSatisfaction] = useState(selectedSatisfaction);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Filtros de satisfacción del cliente</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input"
          placeholder="Ej: Juan Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Ej: cliente@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="input"
          value={satisfaction}
          onChange={(e) => setSatisfaction(e.target.value as any)}
        >
          <option>Todas</option>
          <option>Positiva</option>
          <option>Negativa</option>
          <option>Neutra</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => {
            setName("");
            setEmail("");
            setSatisfaction("Todas");
            onClear();
          }}
          className="px-4 py-2 rounded bg-gray-200"
        >
          Limpiar
        </button>

        <button
          onClick={() =>
            onSearch({ name, email, satisfaction })
          }
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default AdminCustomerSatisfactionFilter;
