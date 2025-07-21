// components/Reports/SalesFilters/CustomerInactiveReportFilter.tsx

import { CustomerStatus } from "../../../types/CustomerTypes";

interface Props {
  selectedStatus: CustomerStatus | "All";
  onChange: (status: CustomerStatus | "All") => void;
}

export default function CustomerInactiveReportFilter({ selectedStatus, onChange }: Props) {
  return (
    <select
      value={selectedStatus}
      onChange={(e) => onChange(e.target.value as CustomerStatus | "All")}
      className="border border-gray-300 rounded px-3 py-2 focus:bg-red-100 focus:outline-gray-400 transition-colors duration-500"
    >
      <option value="All">Todos</option>
      <option value={CustomerStatus.Active}>Activo</option>
      <option value={CustomerStatus.Inactive}>Inactivo</option>
      <option value={CustomerStatus.Lost}>Perdido</option>
    </select>
  );
}
