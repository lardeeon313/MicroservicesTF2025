
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
    <div className="flex items-center gap-4 mb-6 bg-white shadow-md p-4 rounded-xl">
      {/* Fecha desde */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Desde:</label>
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      {/* Fecha hasta */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Hasta:</label>
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      {/* Buscador */}
      <div className="flex flex-col w-full">
        <label className="text-sm text-gray-600 mb-1">Buscar:</label>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
          />
      </div>

      {/* Botón limpiar */}
      <div className="flex flex-row items-center ">
        <button
          onClick={onClear}
          className="bg-gray-400 hover:bg-gray-500 transition-colors text-white px-5 py-2 rounded-lg shadow"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}

