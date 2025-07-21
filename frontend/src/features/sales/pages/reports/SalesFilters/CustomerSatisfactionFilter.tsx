import React from "react";

type Props = {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
};

const CustomerSatisfactionFilter: React.FC<Props> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div>
        <label className="text-sm text-gray-700 mr-2">Desde:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-gray-700 mr-2">Hasta:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};

export default CustomerSatisfactionFilter;
