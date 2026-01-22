import { SalesRangeReport } from "../Types/SalesPerfomanceReportType";

interface Props {
  salesRange: SalesRangeReport;
  setSalesRange: (value: SalesRangeReport) => void;
  dateFrom: string | null;
  setDateFrom: (value: string | null) => void;
  dateTo: string | null;
  setDateTo: (value: string | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

const AdminSalesPerfomanceReportFilter = ({
  salesRange,
  setSalesRange,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onSearch,
  onClear,
}: Props) => {

  const handleRangeChange = (value: SalesRangeReport) => {
    setSalesRange(value);

    setDateFrom(null);
    setDateTo(null);
  };

  const handleDateFromChange = (value: string | null) => {
    setDateFrom(value);

    setSalesRange(SalesRangeReport.All);
  };

  const handleDateToChange = (value: string | null) => {
    setDateTo(value);
    setSalesRange(SalesRangeReport.All);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Filtros de Reporte
      </h3>

      <div className="flex flex-wrap gap-4">
        {/* Fecha desde */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Fecha desde</label>
          <input
            type="date"
            value={dateFrom ?? ""}
            onChange={(e) => handleDateFromChange(e.target.value || null)}
            className="border rounded-md px-3 py-2"
          />
        </div>

        {/* Fecha hasta */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Fecha hasta</label>
          <input
            type="date"
            value={dateTo ?? ""}
            onChange={(e) => handleDateToChange(e.target.value || null)}
            className="border rounded-md px-3 py-2"
          />
        </div>

        {/* Rango */}
        <div className="flex flex-col min-w-[220px]">
          <label className="text-sm text-red-600 mb-1">
            Antigüedad de pedidos
          </label>
          <select
            value={salesRange}
            onChange={(e) => handleRangeChange(e.target.value as SalesRangeReport)}
            className="border rounded-md px-3 py-2"
          >
            {Object.values(SalesRangeReport).map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Limpiar
        </button>

        <button
          onClick={onSearch}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default AdminSalesPerfomanceReportFilter;