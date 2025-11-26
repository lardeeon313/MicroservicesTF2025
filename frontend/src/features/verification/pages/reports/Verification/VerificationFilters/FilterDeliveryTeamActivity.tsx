import React, { useState } from "react";

type Props = {
  onFilter: (filters: {
    startDate?: string;
    endDate?: string;
    deliveryTeamId?: number;
  }) => void;
  onClear: () => void;
};

const DeliveryTeamActivityFilter: React.FC<Props> = ({ onFilter, onClear }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamId, setTeamId] = useState<number | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      deliveryTeamId: teamId,
    });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setTeamId(undefined);
    onClear();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end justify-around gap-6"
    >
      {/* Fecha inicio */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Fecha inicio
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha fin */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Fecha fin
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ID de Equipo */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Buscar por numero de equipo
        </label>
        <input
          type="number"
          placeholder="Ej: 3"
          value={teamId ?? ""}
          onChange={(e) => setTeamId(Number(e.target.value) || undefined)}
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

export default DeliveryTeamActivityFilter;
