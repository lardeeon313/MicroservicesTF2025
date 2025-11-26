import React , {useEffect }from "react";
//import { Calendar } from "lucide-react";

type Props = {
  filterType: "day"|"month"|"quincena"|"range";
  onFilterTypeChange: (value: "day"|"month"|"quincena"|"range") => void;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
};

const TeamProductivityDateFilter: React.FC<Props> = ({
  filterType,
  onFilterTypeChange,
  from,
  to,
  onFromChange,
  onToChange,
}) => {

  useEffect(() => {
  }, [filterType, from, to])
  return (
    <div className="flex flex-col gap-4 bg-white shadow-md p-4 rounded-xl">

      {/* Selectores */}
      <div className="flex gap-3 justify-center">
        <button className={`px-4 py-2 rounded-md ${filterType === "day" ? "bg-red-500 text-white":"bg-gray-200"}`} onClick={() => onFilterTypeChange("day")}>Día</button>
        <button className={`px-4 py-2 rounded-md ${filterType === "month" ? "bg-red-500 text-white":"bg-gray-200"}`} onClick={() => onFilterTypeChange("month")}>Mes</button>
        <button className={`px-4 py-2 rounded-md ${filterType === "quincena" ? "bg-red-500 text-white":"bg-gray-200"}`} onClick={() => onFilterTypeChange("quincena")}>Quincena</button>
        <button className={`px-4 py-2 rounded-md ${filterType === "range" ? "bg-red-500 text-white":"bg-gray-200"}`} onClick={() => onFilterTypeChange("range")}>Rango</button>
      </div>

      {/* Si es rango, mostramos inputs */}
      {filterType === "range" && (
      <div className="flex gap-10 justify-center mt-3">

        {/* Desde */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="
              w-40
              px-3 py-2
              border border-gray-300 
              rounded-xl
              shadow-sm
              focus:ring-2 focus:ring-red-400
              focus:outline-none
            "
          />
        </div>

        {/* Hasta */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="
              w-40
              px-3 py-2
              border border-gray-300 
              rounded-xl
              shadow-sm
              focus:ring-2 focus:ring-red-400
              focus:outline-none
            "
          />
        </div>

      </div>
    )}
    </div>
  );
};

export default TeamProductivityDateFilter;
