import { useState } from "react";

type Props = {
  onSearch: (filters: {
    customerName?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => void;
};

export default function InvoicedOrdersFilter({ onSearch }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleSearch = () => {
    onSearch({
      customerName,
      fromDate,
      toDate,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
  };

  const handleClear = () => {
    setCustomerName("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");

    onSearch({});
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Buscar órdenes facturadas</h2>

      <div className="flex gap-2 items-end">

        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">Nombre del Cliente:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">Fecha desde:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">Fecha hasta:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">Monto mínimo:</label>
          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">Monto máximo:</label>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex w-1/5 justify-around">
          <button
            onClick={handleSearch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Buscar
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
          >
            Limpiar
          </button>
        </div>

      </div>
    </div>
  );
}
