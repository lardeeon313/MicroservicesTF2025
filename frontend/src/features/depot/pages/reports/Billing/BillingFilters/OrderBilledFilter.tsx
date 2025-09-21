import { useState } from "react";

type Props = {
  onSearch: (filters: { customerName?: string }) => void;
};

export default function InvoicedOrdersFilter({ onSearch }: Props) {
  const [customerName, setCustomerName] = useState("");

  const handleSearch = () => {
    onSearch({ customerName });
  };

  const handleClear = () => {
    setCustomerName("");
    onSearch({});
  };

  return (
    <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Buscar órdenes facturadas</h2>

      <div className="flex gap-2 items-end">
        {/* Input ocupa 80% */}
        <div className="flex-1">
          <label className="text-sm font-medium px-2 text-gray-600 mb-1">
            Nombre del Cliente:
          </label>
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none transition w-full"
          />
        </div>

        {/* Botones ocupan 20% */}
        <div className="flex w-1/5 justify-around">
          <button
            onClick={handleSearch}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Buscar
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

  );
}
