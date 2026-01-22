import React, { useState } from "react";
import { Search, X, Calendar, User, Building2 } from "lucide-react";

interface Props {
  onSearch: (filters: any) => void;
}

const ProcessingTimeFilter: React.FC<Props> = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [oper, setOper] = useState("");
  const [customer, setCustomer] = useState("");

  const handleSearch = () => {
    onSearch({ from, to, oper, customer, page: 1 });
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setOper("");
    setCustomer("");

    onSearch({
      from: null,
      to: null,
      oper: null,
      customer: null,
      page: 1,
    });
  };

  const hasActiveFilters = from || to || oper || customer;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Search className="text-red-600" size={20} />
            Filtros de Búsqueda
          </h3>
          {hasActiveFilters && (
            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
              Filtros activos
            </span>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Fecha Desde */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              Fecha Desde
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition outline-none text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          {/* Fecha Hasta */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              Fecha Hasta
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {/* Operario */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 items-center gap-2">
              <User size={16} className="text-gray-500" />
              Operario
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition outline-none text-sm"
              value={oper}
              onChange={(e) => setOper(e.target.value)}
              placeholder="Nombre del operario"
            />
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 items-center gap-2">
              <Building2 size={16} className="text-gray-500" />
              Cliente
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none text-sm placeholder:text-gray-400"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleSearch}
            className="sm:min-w-[140px] flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search size={18} />
            Buscar
          </button>

          <button
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="sm:min-w-[140px] flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          >
            <X size={18} />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingTimeFilter;