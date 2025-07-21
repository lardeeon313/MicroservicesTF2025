import React from "react";
import { SlidersHorizontal } from "lucide-react";

type Props = {
  minOrders: number | "";
  maxOrders: number | "";
  onMinChange: (value: number | "") => void;
  onMaxChange: (value: number | "") => void;
};

const TeamPrpdictivityFilter: React.FC<Props> = ({
  minOrders,
  maxOrders,
  onMinChange,
  onMaxChange,
}) => {
  return (
    <div className="w-full max-w-2xl p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <SlidersHorizontal className="w-5 h-5 text-red-500" />
        <h3 className="text-base font-semibold tracking-wide">Filtrar por cantidad de pedidos</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-sm font-medium text-gray-600 mb-1">Mínimo</label>
          <input
            type="number"
            min={0}
            value={minOrders}
            onChange={(e) => onMinChange(e.target.value === "" ? "" : parseInt(e.target.value))}
            placeholder="Ej: 5"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2">
          <label className="text-sm font-medium text-gray-600 mb-1">Máximo</label>
          <input
            type="number"
            min={0}
            value={maxOrders}
            onChange={(e) => onMaxChange(e.target.value === "" ? "" : parseInt(e.target.value))}
            placeholder="Ej: 20"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};

export default TeamPrpdictivityFilter;

