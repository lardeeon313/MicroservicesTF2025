import React, { useState } from "react";
import { Calendar, Search } from "lucide-react";

interface Props {
  onSearch: (filters: {
    from: string | null;
    to: string | null;
    agruparPorEquipo: boolean;
  }) => void;
}

export const DepotTeamPerformanceFilter: React.FC<Props> = ({ onSearch }) => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<string | null>(null);
  const [agrupar, setAgrupar] = useState(true);

  const handleFromChange = (value: string) => {
    setFrom(value);
    if (value) setPeriodo(null);
  };

  const handleToChange = (value: string) => {
    setTo(value);
    if (value) setPeriodo(null);
  };

  const handlePeriodoChange = (value: string) => {
    setPeriodo(value);
    setFrom(null);
    setTo(null);
  };

  const calcularPeriodo = () => {
    if (!periodo) return { from, to };

    const hoy = new Date();
    let desde = new Date();

    switch (periodo) {
      case "hoy":
        desde = new Date();
        break;
      case "semana":
        desde.setDate(hoy.getDate() - 7);
        break;
      case "quincena":
        desde.setDate(hoy.getDate() - 15);
        break;
      case "mes":
        desde.setMonth(hoy.getMonth() - 1);
        break;
    }

    const format = (d: Date) => d.toISOString().split("T")[0];

    return {
      from: format(desde),
      to: format(hoy),
    };
  };

  const handleSubmit = () => {
    const { from: f, to: t } = calcularPeriodo();
    onSearch({
      from: f,
      to: t,
      agruparPorEquipo: agrupar,
    });
  };

  const handleClear = () => {
    setFrom(null);
    setTo(null);
    setPeriodo(null);
    setAgrupar(true);

    onSearch({
      from: null,
      to: null,
      agruparPorEquipo: true,
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-5">
        <Search className="w-4 h-4 text-red-600" />
        <h3 className="text-sm font-semibold text-gray-700">
          Filtros de Búsqueda
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* FECHA DESDE */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Fecha Desde
          </label>
          <input
            type="date"
            value={from || ""}
            onChange={(e) => handleFromChange(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm
                       focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                       bg-white"
          />
        </div>

        {/* FECHA HASTA */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Fecha Hasta
          </label>
          <input
            type="date"
            value={to || ""}
            onChange={(e) => handleToChange(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm
                       focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                       bg-white"
          />
        </div>

        {/* PERÍODO */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-600 mb-2">
            Período predefinido
          </label>
          <select
            value={periodo || ""}
            onChange={(e) => handlePeriodoChange(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm
                       focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
                       bg-white cursor-pointer text-gray-500"
          >
            <option value="">Seleccione período...</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Últimos 7 días</option>
            <option value="quincena">Últimos 15 días</option>
            <option value="mes">Último mes</option>
          </select>
        </div>

        {/* AGRUPAR */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={agrupar}
              onChange={() => setAgrupar(!agrupar)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-red-600 transition-all"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all peer-checked:translate-x-5"></div>
          </label>
          <span className="text-sm text-gray-700">Agrupar por equipo</span>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-5 py-2 rounded text-sm font-medium
                     border border-gray-300 text-gray-700
                     hover:bg-gray-100 transition-colors"
        >
          Limpiar
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 
                     rounded text-sm font-medium hover:bg-red-700 
                     transition-colors shadow-sm"
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>
    </div>
  );
};
