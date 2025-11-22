import React, { useState } from "react";

interface FilterProps {
  onFilterChange: (filters: {
    startDate?: string;
    endDate?: string;
    deliveryZoneId?: number;
    deliveryTeamId?: number;
    operatorId?: string;
  }) => void;
  onClear: () => void;
}

const DeliveryRejectionsFilter: React.FC<FilterProps> = ({
  onFilterChange,
  onClear,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryZoneId, setDeliveryZoneId] = useState<number | undefined>();
  const [deliveryTeamId, setDeliveryTeamId] = useState<number | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onFilterChange({
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      deliveryZoneId,
      deliveryTeamId,
    });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setDeliveryZoneId(undefined);
    setDeliveryTeamId(undefined);

    onFilterChange({});
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end justify-around gap-6"
    >
      {/* Fecha inicio */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Fecha inicio</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha fin */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Fecha fin</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>


      {/* Equipo */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Equipo</label>
        <input
          type="number"
          placeholder="Ej: 5"
          value={deliveryTeamId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setDeliveryTeamId(value ? Number(value) : undefined);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botones */}
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

export default DeliveryRejectionsFilter;
