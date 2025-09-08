import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAverageTimeOrder } from "../DepotHocks/useAverageTimeOrder";
import GraphAverageTimeOrder from "../DepotGraph/GraphAverageTimeOrder";
import AverageTimeOrderTable from "../DepotComponents/AverageTimeOrderTable";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";

// componente de filtros separados
import AverageTimeOrderFilter from "../DepotFilters/AverageTimeOrderFilter";

const AverageTimeOrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [idFilter, setIdFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const { data: orders, loading, totalPages } = useAverageTimeOrder(page, pageSize);

  const filterOrders = orders.filter((order) => {
    const matchesId = order.id.toString().includes(idFilter);
    const started = order.startedDate ? new Date(order.startedDate) : null;
    const finished = order.finishDate ? new Date(order.finishDate) : null;
    const matchesStartDate =
      !startDateFilter || (started && started >= new Date(startDateFilter));
    const matchesEndDate =
      !endDateFilter || (finished && finished <= new Date(endDateFilter));
    return matchesId && matchesStartDate && matchesEndDate;
  });

  // Map Order[] to ArmTime[]
  const armTimeData = filterOrders.map(order => ({
    id: order.id,
    orderId: order.id, // or order.orderId if available
    oldStatus: 0, // Set appropriate value if available
    newStatus: 0, // Set appropriate value if available
    changedAt: order.modifiedStatusDate || order.startedDate || "",
    averageDuration: order.finishDate && order.startedDate ? (new Date(order.finishDate).getTime() - new Date(order.startedDate).getTime()) / 60000 : 0
  }));

  if (loading) {
    return <LoadingSpinner message="Cargando datos..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/depot/depotmanager/reports/AverageTimerOrder"
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

        <AverageTimeOrderFilter
          idFilter={idFilter}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          onIdChange={setIdFilter}
          onStartDateChange={setStartDateFilter}
          onEndDateChange={setEndDateFilter}
        />

  <AverageTimeOrderTable armTime={armTimeData} />
  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
  <GraphAverageTimeOrder data={armTimeData} />
      </div>
    </div>
  );
};

export default AverageTimeOrderPage;
