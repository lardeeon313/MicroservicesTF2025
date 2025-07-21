import React from "react";

type TotalIncomeFilterProps = {
  minIncome: number | "";
  maxIncome: number | "";
  onMinChange: (value: number | "") => void;
  onMaxChange: (value: number | "") => void;
};

const BillingTimeProcessFilter: React.FC<TotalIncomeFilterProps> = ({
  minIncome,
  maxIncome,
  onMinChange,
  onMaxChange,
}) => {
  return (
    <div className="flex flex-wrap gap-6 items-end bg-white p-4 rounded-2xl shadow-md border border-gray-200 max-w-md">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Ingreso mínimo
        </label>
        <input
          type="number"
          placeholder="Mínimo..."
          className="border border-gray-300 rounded-xl px-4 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={minIncome}
          onChange={(e) => {
            const value = e.target.value;
            onMinChange(value === "" ? "" : parseFloat(value));
          }}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Ingreso máximo
        </label>
        <input
          type="number"
          placeholder="Máximo..."
          className="border border-gray-300 rounded-xl px-4 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={maxIncome}
          onChange={(e) => {
            const value = e.target.value;
            onMaxChange(value === "" ? "" : parseFloat(value));
          }}
        />
      </div>
    </div>
  );
};

export default BillingTimeProcessFilter;
