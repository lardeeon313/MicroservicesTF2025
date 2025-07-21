import React from "react";
import { CalendarClock } from "lucide-react";

interface CustomerIncomeFilterProps {
  ageFilter: string;
  onAgeFilterChange: (value: string) => void;
}

const CustomerIncomeFilter: React.FC<CustomerIncomeFilterProps> = ({
  ageFilter,
  onAgeFilterChange,
}) => {
  return (
    <div className="flex items-center gap-3 my-4 w-full max-w-sm">
      <label className="flex items-center gap-2 w-full border border-gray-300 rounded px-3 py-2 focus-within:bg-red-100 focus-within:border-red-400 transition-all">
        <CalendarClock className="w-5 h-5 text-gray-500" />
        <input
          type="number"
          min={0}
          placeholder="Antigüedad del cliente (años)"
          className="w-full bg-transparent outline-none placeholder-gray-400"
          value={ageFilter}
          onChange={(e) => onAgeFilterChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default CustomerIncomeFilter;
