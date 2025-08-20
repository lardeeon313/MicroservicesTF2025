import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAverageTimeOrder } from "../DepotHocks/useAverageTimeOrder";
import AverageTimeOrderTable from "../DepotComponents/AverageTimeOrderTable";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import AverageTimeOrderFilter from "../DepotFilters/AverageTimeOrderFilter";

import type { ArmTime } from "../DepotComponents/AverageTimeOrderTable";
import GraphAverageTimeOrder from "../DepotGraph/GraphAverageTimeOrder";

const AverageTimeOrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [idFilter, setIdFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const { data: orders, loading, totalPages } = useAverageTimeOrder(page, pageSize);

  // 🔧 Adaptamos la data de la API al tipo ArmTime
  const adaptedOrders: ArmTime[] = orders.map((order, index) => ({
    id: order.id ?? index,
    orderId: order.orderId ?? index,
    oldStatus: Number(order.oldStatus ?? 0),
    newStatus: Number(order.newStatus ?? 0),
    changedAt: order.changedAt
      ? new Date(order.changedAt).toISOString()
      : new Date().toISOString(),
    averageDuration: order.averageDuration ?? 0,
  }));

  // 📌 estado auxiliar para manejar filtros aplicados
  const [filteredData, setFilteredData] = useState<ArmTime[]>(adaptedOrders);

  // 🔍 Buscar
  const handleSearch = () => {
    const filtered = adaptedOrders.filter((order) => {
      const matchesId = order.orderId.toString().includes(idFilter);

      // ejemplo básico para fechas
      const matchesStartDate = startDateFilter
        ? new Date(order.changedAt) >= new Date(startDateFilter)
        : true;
      const matchesEndDate = endDateFilter
        ? new Date(order.changedAt) <= new Date(endDateFilter)
        : true;

      return matchesId && matchesStartDate && matchesEndDate;
    });

    setFilteredData(filtered);
  };

  // 🧹 Limpiar
  const handleClear = () => {
    setIdFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setFilteredData(adaptedOrders);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/depot/reports"
          className="text-red-600 hover:underline pl-10"
        >
          ← Volver atrás
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Tiempo promedio para el armado del pedido:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar cuánto tiempo lleva armar los pedidos realizados por los clientes.
        </p>

        {/* Filtros */}
        <AverageTimeOrderFilter
          idFilter={idFilter}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          onIdChange={setIdFilter}
          onStartDateChange={setStartDateFilter}
          onEndDateChange={setEndDateFilter}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Tabla con datos adaptados */}
        <AverageTimeOrderTable armTime={filteredData} />

        {/* Paginación */}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        {/* Gráfico */}
        <GraphAverageTimeOrder data={filteredData} />
      </div>
    </div>
  );
};


export default AverageTimeOrderPage;
