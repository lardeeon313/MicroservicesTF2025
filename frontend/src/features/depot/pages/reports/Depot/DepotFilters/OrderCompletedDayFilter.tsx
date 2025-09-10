
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;  // 👈 debería aceptar string, no Date
  onClear: () => void;
};

export default function OrderCompletedDayFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  searchTerm,
  onSearchTermChange,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 p-4 bg-gray-100 rounded-xl shadow-inner">
      {/* Fecha desde */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-700">Desde:</label>
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Fecha hasta */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-700">Hasta:</label>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Buscador */}
      <div className="w-full sm:w-auto">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm w-full"
        />
      </div>

      {/* Botón limpiar */}
      <button
        onClick={onClear}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors w-full sm:w-auto"
      >
        Limpiar
      </button>
    </div>
  );
}

