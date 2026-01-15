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
import { Eye, EyeOff, RefreshCw } from "lucide-react";

const CustomerReportPaymentTypePage: React.FC = () => {
  const [filters, setFilters] = useState<CustomerReportFilters>({
    name: "",
    startDate: "",
    endDate: "",
    paymentType: [],
  });

  const { data, loading } = useCustomerReport(filters);

  // Estado para mostrar/ocultar gráfico
  const [showGraph, setShowGraph] = useState(false);

  const handleRefresh = () => {
    // Refresca recargando la página
    window.location.reload();
  };

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
          Tipos de pago por cliente
        </h1>

        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar los diferentes tipos de pago utilizados por cada cliente.
        </p>

        {/* 🔍 FILTROS */}
        <div className="mb-4">
          <CustomerReportFilterPayment filters={filters} setFilters={setFilters} />
        </div>

        {/* Botones alineados a la derecha, debajo de los filtros */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-blue-600 hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            {showGraph ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
            {showGraph ? "Ocultar Gráfico" : "Mostrar Gráfico"}
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg shadow text-white font-medium bg-red-600 hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
          >
            <RefreshCw className="w-5 h-5" />
            Refrescar Reporte
          </button>
        </div>


        {/* 📊 TABLA */}
        <CustomerReportPaymentTable data={data} loading={loading} />

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