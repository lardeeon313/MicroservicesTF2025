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
    <div className="bg-gray-100 shadow-md p-4 rounded-lg mb-6">
      <h2 className="text-lg font-bold mb-3">Buscar órdenes facturadas</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
        >
          Buscar
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
