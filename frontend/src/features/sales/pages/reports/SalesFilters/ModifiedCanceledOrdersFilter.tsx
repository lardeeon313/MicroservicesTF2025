import React from "react";
import { FilterStatus } from "../ModifiedCanceledOrdersPage";

type Props = {
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
    <div className="mb-6 p-6 border border-gray-200 rounded-2xl shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">
        Filtros de Órdenes Modificadas/Canceladas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nameDraft}
            onChange={(e) => onNameDraftChange(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Fecha */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            value={dateDraft}
            onChange={(e) => onDateDraftChange(e.target.value)}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={statusDraft}
            onChange={(e) =>
              onStatusDraftChange(e.target.value as FilterStatus)
            }
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="Todos">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="issued">Emitido</option>
            <option value="canceled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onLimpiar}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
        <button
          onClick={onBuscar}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default ModifiedCanceledOrdersFilter;

