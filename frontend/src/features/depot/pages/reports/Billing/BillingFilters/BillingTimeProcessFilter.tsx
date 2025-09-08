import React from "react";

type Props = {
  minIncome: number | "";
  maxIncome: number | "";
  onMinChange: (value: number | "") => void;
  onMaxChange: (value: number | "") => void;
};

const BillingTimeProcessFilter: React.FC<Props> = ({ minIncome, maxIncome, onMinChange, onMaxChange }) => {
  return (
    <div className="flex gap-4 items-end mb-4 bg-gray-100 p-4 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Ingreso mínimo:</label>
        <input
          type="number"
          value={minIncome}
          onChange={e => onMinChange(e.target.value === "" ? "" : Number(e.target.value))}
          className="border rounded px-2 py-1"
          placeholder="Mínimo"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Ingreso máximo:</label>
        <input
          type="number"
          value={maxIncome}
          onChange={e => onMaxChange(e.target.value === "" ? "" : Number(e.target.value))}
          className="border rounded px-2 py-1"
          placeholder="Máximo"
        />
      </div>
    </div>
  );
};

export default BillingTimeProcessFilter;

