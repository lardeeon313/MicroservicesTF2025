import React, { useState } from "react";

type OrderFilterProps = {
  onFilterChange: (minOrderCount: number) => void;
};

const OrderCountFilter: React.FC<OrderFilterProps> = ({ onFilterChange }) => {
  const [minOrders, setMinOrders] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinOrders(value);
    onFilterChange(value);
  };

  return (
    <div className="mb-4 flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700">
        Filtrar por mínimo de pedidos:
      </label>
      <input
        type="number"
        value={minOrders}
        onChange={handleChange}
        className="w-24 rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        min={0}
      />
    </div>
  );
};

export default OrderCountFilter;
