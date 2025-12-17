import { useState } from "react";

type PeriodType = "day" | "week" | "month" | "fortnight";

type Props = {
  onSearch: (filters: {
    customerName?: string;
    fromDate?: string;
    toDate?: string;
    minAmount?: number;
    maxAmount?: number;
    period?: PeriodType;
  }) => void;
};

export default function InvoicedOrdersFilter({ onSearch }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // 💡 period bien tipado
  const [period, setPeriod] = useState<PeriodType | undefined>(undefined);

  const handleSearch = () => {
    onSearch({
      customerName,
      fromDate,
      toDate,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      period: period ?? undefined,
    });
  };

  const handleClear = () => {
    setCustomerName("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");
    setPeriod(undefined);

    onSearch({});
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Buscar órdenes facturadas</h2>

      <div className="flex gap-2 items-end">

        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">Cliente:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm px-2 text-gray-600">Fecha desde:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm px-2 text-gray-600">Fecha hasta:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm px-2 text-gray-600">Período:</label>
          <select
            value={period ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setPeriod(val === "" ? undefined : (val as PeriodType));
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            <option value="">Seleccionar...</option>
            <option value="day">Día</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="fortnight">Quincena</option>
          </select>
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
