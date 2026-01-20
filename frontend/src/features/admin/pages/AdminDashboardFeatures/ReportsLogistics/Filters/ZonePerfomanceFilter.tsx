import React, { useState } from "react";

interface Props {
  onFilter: (
    startDate?: string,
    endDate?: string,
    operatorId?: string,
    deliveryTeamId?: number
  ) => void;
  onClear: () => void;
}

export const FilterZonePerformance: React.FC<Props> = ({
  onFilter,
  onClear,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [deliveryTeamId, setDeliveryTeamId] = useState<number | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(
      startDate ? new Date(startDate).toISOString() : undefined,
      endDate ? new Date(endDate).toISOString() : undefined,
      operatorId || undefined,
      deliveryTeamId
    );
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setOperatorId("");
    setDeliveryTeamId(undefined);
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mb-6 flex flex-wrap items-end justify-around gap-6"
    >
    
      
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Buscar por numero de zona
        </label>
        <input
          type="number"
          placeholder="Ej: 1"
          value={deliveryTeamId ?? ""}
          onChange={(e) =>
            setDeliveryTeamId(Number(e.target.value) || undefined)
          }
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
        >
          Buscar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};
