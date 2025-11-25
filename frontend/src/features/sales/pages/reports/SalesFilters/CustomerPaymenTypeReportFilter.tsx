import React, { useState, useEffect } from "react";
import { CustomerReportFilters } from "../SalesPages/useSalesPaymentTypeReport";

interface Props {
  filters: CustomerReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<CustomerReportFilters>>;
}

const CustomerReportFilterPayment: React.FC<Props> = ({ filters, setFilters }) => {
  // Estado local (inputs sin activar filtro aún)
  const [temp, setTemp] = useState<CustomerReportFilters>({
    name: filters.name || "",
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
    paymentType: filters.paymentType || "",
  });

  // Si los filtros externos cambian → sincroniza el estado temporal
  useEffect(() => {
    setTemp({
      name: filters.name || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      paymentType: filters.paymentType || "",
    });
  }, [filters]);

  const update = (field: keyof CustomerReportFilters, value: string) => {
    setTemp((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setFilters(temp);
  };

  const handleClear = () => {
    const cleared: CustomerReportFilters = {
      name: "",
      startDate: "",
      endDate: "",
      paymentType: "",
    };

    setTemp(cleared);
    setFilters(cleared);
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-md rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Filtros del reporte</h3>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Nombre del cliente</label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            value={temp.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        {/* Tipo de pago */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Tipo de pago</label>
          <input
            type="text"
            placeholder="Escribe el tipo de pago"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            value={temp.paymentType}
            onChange={(e) => update("paymentType", e.target.value)}
          />
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleClear}
          className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
        >
          Limpiar
        </button>

        <button
          onClick={handleSearch}
          className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium shadow"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default CustomerReportFilterPayment;
