// src/features/sales/pages/SalesFilters/ModifiedCanceledOrdersFilter.tsx
// src/features/sales/pages/SalesFilters/ModifiedCanceledOrdersFilter.tsx
import React from "react";
import { FilterStatus } from "../ModifiedCanceledOrdersPage";

type Props = {
  // OJO: estos son los *drafts*, no los filtros aplicados
  nameDraft: string;
  dateDraft: string;
  statusDraft: FilterStatus;
  onNameDraftChange: (value: string) => void;
  onDateDraftChange: (value: string) => void;
  onStatusDraftChange: (value: FilterStatus) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
};

const ModifiedCanceledOrdersFilter: React.FC<Props> = ({
  nameDraft,
  dateDraft,
  statusDraft,
  onNameDraftChange,
  onDateDraftChange,
  onStatusDraftChange,
  onBuscar,
  onLimpiar,
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Nombre */}
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={nameDraft}
          onChange={(e) => onNameDraftChange(e.target.value)}
          className="border rounded p-2 w-full"
        />

        {/* Fecha */}
        <input
          type="date"
          value={dateDraft}
          onChange={(e) => onDateDraftChange(e.target.value)}
          className="border rounded p-2 w-full"
        />

        {/* Estado */}
        <select
          value={statusDraft}
          onChange={(e) => onStatusDraftChange(e.target.value as FilterStatus)}
          className="border rounded p-2 w-full"
        >
          <option value="Todos">Todos</option>
          <option value="Pending">Pendiente</option>
          <option value="Issued">Emitido</option>
          <option value="Canceled">Cancelado</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={onBuscar}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Buscar
        </button>
        <button
          onClick={onLimpiar}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default ModifiedCanceledOrdersFilter;


