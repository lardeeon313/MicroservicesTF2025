import React from "react";

type Props = {
  filterText: string;
  onFilterChange: (text: string) => void;
};

const CustomerReportFilter: React.FC<Props> = ({ filterText, onFilterChange }) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Buscar por nombre o email..."
      value={filterText}
      onChange={(e) => onFilterChange(e.target.value)}
      className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);

export default CustomerReportFilter;    