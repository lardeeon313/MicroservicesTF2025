import React, { useState } from "react";

// Hook del reporte
import { useCustomerReport } from "./SalesPages/useSalesPaymentTypeReport";
import { CustomerReportFilters } from "./SalesPages/useSalesPaymentTypeReport";

// Filtros y tabla
import CustomerReportFilterPayment from "./SalesFilters/CustomerPaymenTypeReportFilter";
import CustomerReportPaymentTable from "./SalesComponents/IndividualComponentsSales/CustomerPaymentTypeReportTable";

// Reutilizables globales
import BackButton from "../../../../components/BackButton";
import LoadingSpinner from "../../../../components/LoadingSpinner";

import GraphCustomerPaymenTypeReport from "./SalesGraph/GraphCustomerPaymentTypeReport";

const CustomerReportPaymentTypePage: React.FC = () => {
  const [filters, setFilters] = useState<CustomerReportFilters>({
    name: "",
    startDate: "",
    endDate: "",
    paymentType: "",
  });

  const { data, loading } = useCustomerReport(filters);

  // 👇 Estado para mostrar/ocultar gráfico
  const [showGraph, setShowGraph] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Cargando reporte..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      {/* 🔙 Botón volver */}
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/sales/reports/dashboard" />
      </div>

      {/* 🔹 Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Clientes por Tipo de Pago
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los diferentes tipos de pago utilizados por cada cliente.
        </p>

        {/* 🔍 FILTROS */}
        <div className="flex flex-col md:flex-row mb-6 w-full justify-between gap-2">
          <CustomerReportFilterPayment filters={filters} setFilters={setFilters} />
        </div>

        {/* 📊 TABLA */}
        <CustomerReportPaymentTable data={data} loading={loading} />

        {/* 🔘 Botón centrado */}
        <div className="flex justify-center mt-6 mb-4">
          <button
            onClick={() => setShowGraph((prev) => !prev)}
            className="px-6 py-2 rounded-xl shadow text-white font-medium bg-gray-600 hover:bg-blue-700 transition"
          >
            {showGraph ? "Ocultar gráfico" : "Mostrar gráfico"}
          </button>
        </div>

        {/* 📉 Gráfico con animación */}
        {showGraph && (
          <div className="mt-8 animate-fadeIn">
            <GraphCustomerPaymenTypeReport data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReportPaymentTypePage;
