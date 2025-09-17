import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAverageTimeOrder } from "../DepotHocks/useAverageTimeOrder";
import AverageTimeOrderTable, { ArmTime } from "../DepotComponents/AverageTimeOrderTable";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import AverageTimeOrderFilter from "../DepotFilters/AverageTimeOrderFilter";
import GraphAverageTimeOrder from "../DepotGraph/GraphAverageTimeOrder";
import BackButton from "../../../../../../components/BackButton";

const AverageTimeOrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [idFilter, setIdFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const { data: orders, loading, totalPages } = useAverageTimeOrder(
    page,
    pageSize,
    startDateFilter || undefined,
    endDateFilter || undefined
  );

  // AdaptedOrders simplemente toma lo que ya devolvió el hook (normalizado)
  const adaptedOrders: ArmTime[] = orders.map((o, i) => ({
    id: o.id ?? i,
    orderId: o.orderId,
    oldStatus: o.oldStatus,
    newStatus: o.newStatus,
    status: o.status,
    changedAt: o.changedAt,
    averageDuration: o.averageDuration ?? 0,
  }));

  const [filteredData, setFilteredData] = useState<ArmTime[]>([]);

  // Actualizamos los datos filtrados cuando cambian los pedidos
  useEffect(() => {
    setFilteredData(adaptedOrders);
  }, [orders]);

  // Buscar
  const handleSearch = () => {
    const filtered = adaptedOrders.filter((order) => {
      

      const matchesStartDate = startDateFilter
        ? !!order.changedAt && new Date(order.changedAt) >= new Date(startDateFilter)
        : true;

      const matchesEndDate = endDateFilter
        ? !!order.changedAt && new Date(order.changedAt) <= new Date(endDateFilter)
        : true;

      return matchesStartDate && matchesEndDate;
    });

    setFilteredData(filtered);
  };

  // Limpiar
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
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/reports"></BackButton>
          to="/depot/reports"
          className="text-red-600 hover:underline pl-10"
        >
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Tiempo promedio para el armado del pedido:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar cuánto tiempo lleva armar los pedidos realizados por los clientes.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Tiempo promedio para el armado del pedido:</h1>
        <p className="text-center text-lg text-gray-700 mb-12">Aquí podrás visualizar cuánto tiempo lleva armar los pedidos realizados por los clientes.</p>

        <AverageTimeOrderFilter
          idFilter={idFilter}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          onIdChange={setIdFilter}
          onStartDateChange={setStartDateFilter}
        {/* ← Nota: ahora pasamos `data` y `loading` */}
        <AverageTimeOrderTable data={filteredData} loading={loading} />
          onClear={handleClear}
        {/* Paginación */}
        />

        {/* Gráfico */}
        {/* ← Nota: ahora pasamos `data` y `loading` */}
        <AverageTimeOrderTable data={filteredData} loading={loading} />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

        <GraphAverageTimeOrder data={filteredData} />
      </div>
  );
};

export default AverageTimeOrderPage;

