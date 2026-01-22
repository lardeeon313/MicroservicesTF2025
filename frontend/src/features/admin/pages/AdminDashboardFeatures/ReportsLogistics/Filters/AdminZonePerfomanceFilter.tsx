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

export const AdminFilterZonePerformance: React.FC<Props> = ({
  onFilter,
  onClear,
}) => {
  const [deliveryTeamId, setDeliveryTeamId] = useState<number | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onFilter(
      undefined,
      undefined,
      undefined,
      deliveryTeamId !== undefined
        ? deliveryTeamId - 1 
        : undefined
    );
  };

  const handleClear = () => {
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
          Buscar por número de zona
        </label>
        <input
          type="number"
          min={1}
          placeholder="Ej: 1"
          value={deliveryTeamId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setDeliveryTeamId(value === "" ? undefined : Number(value));
          }}
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
