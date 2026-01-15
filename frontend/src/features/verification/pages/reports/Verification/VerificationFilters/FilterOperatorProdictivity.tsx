import React, { useState } from "react";
import { OperatorProductivityFilterEntity } from "../../../../types/FilterReports/FilterReportsEntity";

interface FilterProps {
  filters: OperatorProductivityFilterEntity;
  onChange: (filters: OperatorProductivityFilterEntity) => void;
}

export const FilterOperatorProductivity: React.FC<FilterProps> = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState<OperatorProductivityFilterEntity>(filters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localFilters); // 🔍 Recién acá se aplica el filtro
  };

  const handleClear = () => {
    const cleared = {
      startDate: "",
      endDate: "",
      deliveryZoneId: undefined,
      deliveryTeamId: undefined,
      paymentType: "",
    };
    setLocalFilters(cleared);
    onChange(cleared); // 🔄 Limpia los filtros en el padre
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 mb-6 flex flex-wrap items-end justify-around gap-6"
    >

      {/* Nombre del repartidor */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Buscar por repartidor:</label>
        <input
          type="text"
          name="operatorName"
          placeholder="Buscar por nombre..."
          value={localFilters.operatorName || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Nombre del equipo */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Buscar por equipo:</label>
        <input
          type="text"
          name="teamName"
          placeholder="Buscar por equipo..."
          value={localFilters.teamName || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>


      {/* Tipo de pago */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Tipo de pago</label>
        <select
          name="paymentType"
          value={localFilters.paymentType || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="transfer">Transferencia</option>
          <option value="credit_Card">Tarjeta crédito</option>
          <option value="debit_Card">Tarjeta débito</option>
          <option value="cash">Efectivo</option>
          <option value="current_Account">Cuenta corriente</option>
          <option value="check">Cheque</option>
          <option value="promissory_Note">Pagaré</option>
        </select>
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
