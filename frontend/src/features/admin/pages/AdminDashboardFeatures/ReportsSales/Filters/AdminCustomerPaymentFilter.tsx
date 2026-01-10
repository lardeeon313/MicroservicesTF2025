import React, { useState, useEffect } from "react";
import { AdminCustomerReportFilters, AdminSalespaymentTypeReportMapper } from "../Types/CustomerPaymentType";


interface Props {
  filters: AdminCustomerReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<AdminCustomerReportFilters>>;
}

const AdminCustomerPaymentFilter: React.FC<Props> = ({
  filters,
  setFilters,
}) => {
  const paymentOptions = Object.values(AdminSalespaymentTypeReportMapper);

  const [temp, setTemp] = useState<AdminCustomerReportFilters>({
    name: filters.name || "",
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
    paymentType: filters.paymentType || [],
  });

  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    setTemp({
      name: filters.name || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      paymentType: filters.paymentType || [],
    });
  }, [filters]);

  const update = (
    field: keyof AdminCustomerReportFilters,
    value: string | string[]
  ) => {
    setTemp((prev) => ({ ...prev, [field]: value }));
  };

  const togglePaymentType = (value: string) => {
    const current = temp.paymentType;
    update(
      "paymentType",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const handleSearch = () => {
    setFilters(temp);
  };

  const handleClear = () => {
    const cleared: AdminCustomerReportFilters = {
      name: "",
      startDate: "",
      endDate: "",
      paymentType: [],
    };

    setTemp(cleared);
    setFilters(cleared);
  };

  return (
    <div className="w-full bg-white border border-gray-200 shadow-md rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Filtros del reporte
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Nombre del cliente
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
            value={temp.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        {/* Tipo de pago */}
        <div className="flex flex-col relative">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Tipo de pago
          </label>

          <div
            className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer bg-white min-h-[42px] flex flex-wrap gap-2"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {temp.paymentType.length === 0 && (
              <span className="text-gray-400">Seleccionar...</span>
            )}

            {temp.paymentType.map((pt) => (
              <span
                key={pt}
                className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm flex items-center gap-2"
              >
                {pt}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePaymentType(pt);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {openDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 shadow-lg rounded-lg z-20 max-h-48 overflow-y-auto">
              {paymentOptions.map((opt) => (
                <div
                  key={opt}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => togglePaymentType(opt)}
                >
                  <input
                    type="checkbox"
                    checked={temp.paymentType.includes(opt)}
                    readOnly
                  />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

export default AdminCustomerPaymentFilter;
