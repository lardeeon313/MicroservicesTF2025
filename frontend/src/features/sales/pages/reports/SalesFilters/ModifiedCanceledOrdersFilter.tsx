import React from "react";
import { FilterStatus } from "../ModifiedCanceledOrdersPage";
import { Info, ArrowRightCircle } from "lucide-react";

type Props = {
  nameDraft: string;
  dateFromDraft: string;
  dateToDraft: string;
  statusDraft: FilterStatus;
  onNameDraftChange: (value: string) => void;
  onDateFromDraftChange: (value: string) => void;
  onDateToDraftChange: (value: string) => void;
  onStatusDraftChange: (value: FilterStatus) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
};

const ModifiedCanceledOrdersFilter: React.FC<Props> = ({
  nameDraft,
  dateFromDraft,
  dateToDraft,
  statusDraft,
  onNameDraftChange,
  onDateFromDraftChange,
  onDateToDraftChange,
  onStatusDraftChange,
  onBuscar,
  onLimpiar,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-6 w-full mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filtros de Órdenes Modificadas/Canceladas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            value={nameDraft}
            onChange={(e) => onNameDraftChange(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Fecha Desde */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
          <input
            type="date"
            value={dateFromDraft}
            onChange={(e) => onDateFromDraftChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Fecha Hasta */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
          <input
            type="date"
            value={dateToDraft}
            onChange={(e) => onDateToDraftChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={statusDraft}
            onChange={(e) => onStatusDraftChange(e.target.value as FilterStatus)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="Todos">Todos</option>
            <option value="Pending">Pendiente</option>
            <option value="PendingResolution">Pendiente de resolución</option>
            <option value="ReIssued">Reemitido</option>
            <option value="PendingReissued">Pendiente de reemisión</option>
            <option value="Canceled">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
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

            {/* Caja visual de estados modificados */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-blue-600" />
          <p className="font-medium text-blue-800">
            Los pedidos que han sido modificados llevaran los estados de: 
          </p>
        </div>

        <div className="space-y-2 text-blue-700 text-sm">
          <div className="flex items-start gap-2">
            <ArrowRightCircle className="w-4 h-4 mt-0.5 text-blue-500" />
            <span>
              <strong>Pendiente de resolución:</strong>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <ArrowRightCircle className="w-4 h-4 mt-0.5 text-blue-500" />
            <span>
              <strong>Reemitido:</strong>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <ArrowRightCircle className="w-4 h-4 mt-0.5 text-blue-500" />
            <span>
              <strong>Pendiente de reemisión:</strong> 
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifiedCanceledOrdersFilter;
