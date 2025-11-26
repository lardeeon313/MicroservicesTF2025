import React, { useState } from "react";
import { DeliveryTimeFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";

interface Props {
  initial?: DeliveryTimeFilterEntity;
  onApply: (f: DeliveryTimeFilterEntity) => void;
}

const FilterDeliveryTimes: React.FC<Props> = ({ initial, onApply }) => {
  const [startDate, setStartDate] = useState(initial?.StartDate ?? "");
  const [endDate, setEndDate] = useState(initial?.EndDate ?? "");
  const [deliveryZoneId, setDeliveryZoneId] = useState<string | "">(
    initial?.DeliveryZoneId?.toString() ?? ""
  );
  const [deliveryTeamId, setDeliveryTeamId] = useState<string | "">(
    initial?.DeliveryTeamId?.toString() ?? ""
  );
  const [operatorId, setOperatorId] = useState(initial?.OperatorId ?? "");

  // 👉 Cuando se presiona “Buscar”
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filter: DeliveryTimeFilterEntity = {};
    if (startDate) filter.StartDate = startDate;
    if (endDate) filter.EndDate = endDate;
    if (deliveryZoneId !== "") filter.DeliveryZoneId = Number(deliveryZoneId);
    if (deliveryTeamId !== "") filter.DeliveryTeamId = Number(deliveryTeamId);
    if (operatorId) filter.OperatorId = operatorId;
    onApply(filter);
  };

  // 👉 Cuando se presiona “Limpiar”
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setDeliveryZoneId("");
    setDeliveryTeamId("");
    setOperatorId("");
    onApply({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-xl mb-6 flex flex-wrap items-end justify-around gap-6"
    >
      {/* Fecha de inicio */}
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

      {/* Fecha de fin */}
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

      {/* ID de Zona */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Numero de Zona
        </label>
        <input
          type="number"
          placeholder="Ej: 1"
          value={deliveryZoneId}
          onChange={(e) => setDeliveryZoneId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ID de Equipo */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Buscar por el numero de equipo
        </label>
        <input
          type="number"
          placeholder="Ej: 2"
          value={deliveryTeamId}
          onChange={(e) => setDeliveryTeamId(e.target.value)}
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

export default FilterDeliveryTimes;
