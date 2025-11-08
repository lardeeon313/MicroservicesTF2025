import React, { useState } from "react";
import { PaymentTypeReport } from "../../../../types/FilterReports/FilterReportsEntity";
import { OrdersByStatusFilters } from "../../../../types/FilterReports/FilterReportsEntity";
import { paymentTypeLabels } from "../../../../types/FilterReports/FilterReportsEntity";
import { OrderStatus } from "../../../../types/OrderTypes";
import { mapPaymentTypeToBackend } from "../../../../types/FilterReports/FilterReportsEntity";

interface Props {
  onFilter: (filters: OrdersByStatusFilters) => void;
  onClear?: () => void;
}

export const OrdersByStatusFiltersFilter: React.FC<Props> = ({ onFilter, onClear }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryZoneId, setDeliveryZoneId] = useState<number | undefined>();
  const [deliveryTeamId, setDeliveryTeamId] = useState<number | undefined>();
  const [operatorId, setOperatorId] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentTypeReport | "">("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");


  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const paymentTypeValue = paymentType ? mapPaymentTypeToBackend(paymentType) : undefined;

  onFilter({
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate).toISOString() : undefined,
    deliveryZoneId,
    deliveryTeamId,
    operatorId: operatorId || undefined,
    paymentType: paymentTypeValue, // Usar paymentType (camelCase)
    orderStatus: orderStatus ? Number(orderStatus) : undefined,
  });
};


  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setDeliveryZoneId(undefined);
    setDeliveryTeamId(undefined);
    setOperatorId("");
    setPaymentType("");
    setOrderStatus("");
    onFilter({});
    onClear?.();
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

      {/* Tipo de pago */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Tipo de pago</label>
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value as PaymentTypeReport | "")}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Seleccionar --</option>
          {Object.entries(paymentTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
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
