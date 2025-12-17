import React, { useState, useEffect } from "react";
import { useAverageTimeOrder } from "../DepotHocks/useAverageTimeOrder";
import AverageTimeOrderTable, { ArmTime } from "../DepotComponents/AverageTimeOrderTable";
import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import { Pagination } from "../../../../../../components/Pagination";
import AverageTimeOrderFilter from "../DepotFilters/AverageTimeOrderFilter";

import BackButton from "../../../../../../components/BackButton";

const AverageTimeOrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [idFilter, setIdFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const [minDurationFilter, setMinDurationFilter] = useState("");
  const [maxDurationFilter, setMaxDurationFilter] = useState("");

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
    customerName: o.customerName,
    oldStatus: o.oldStatus,
    newStatus: o.newStatus,
    status: o.status,
    changedAt: o.changedAt,
    averageDuration: o.averageDuration ?? 0,
  }));

  const [filteredData, setFilteredData] = useState<ArmTime[]>([]);

  // Filtramos solo estados entre Assigned y Prepared (incluyendo intermedios)
  useEffect(() => {
    const filteredOrders = adaptedOrders.filter((o) => {
      // si vienen como números (old/new status)
      if (o.oldStatus !== undefined && o.newStatus !== undefined) {
        return o.oldStatus >= 2 && o.newStatus <= 7;
        // 2 = Assigned, 7 = Prepared (según tu enum del back)
      }

      // si vienen como string combinado
      if (o.status) {
        return (
          o.status.includes("Received") ||
          o.status.includes("ReReceived") ||
          o.status.includes("Assigned") ||
          o.status.includes("InPreparation") ||
          o.status.includes("MissingProduct") ||
          o.status.includes("SentToBilling") ||
          o.status.includes("PendingResolution") ||
          o.status.includes("Prepared") ||
          o.status.includes("Invoiced") ||
          o.status.includes("Issued") ||
          o.status.includes("Cancelled") ||
          o.status.includes("Deleted") ||
          o.status.includes("Verify") ||
          o.status.includes("OnTheWay") ||
          o.status.includes("Delivered") ||
          o.status.includes("PendingVerification") ||
          o.status.includes("AssignedDelivery") ||
          o.status.includes("PendingDelivered") ||
          o.status.includes("PendingIncidentResolution") ||
          o.status.includes("IncidentResolved")
        );
      }

      return false;
    });

    setFilteredData(filteredOrders);
  }, [orders]);

  // Buscar
  const handleSearch = () => {
    const filtered = adaptedOrders.filter((order) => {
      const matchesId = idFilter
        ? order.orderId?.toString().includes(idFilter.trim())
        : true;

      const matchesStartDate = startDateFilter
        ? !!order.changedAt && new Date(order.changedAt) >= new Date(startDateFilter)
        : true;

      const matchesEndDate = endDateFilter
        ? !!order.changedAt && new Date(order.changedAt) <= new Date(endDateFilter)
        : true;

      const matchesMinDuration = minDurationFilter
        ? order.averageDuration >= Number(minDurationFilter)
        : true;

      const matchesMaxDuration = maxDurationFilter
        ? order.averageDuration <= Number(maxDurationFilter)
        : true;

      return (
        matchesId &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinDuration &&
        matchesMaxDuration
      );
    });

    setFilteredData(filtered);
  };



  // Limpiar
  const handleClear = () => {
    setIdFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setFilteredData(adaptedOrders);
    setMinDurationFilter("");
    setMaxDurationFilter("");
  };

  if (loading) {
    return <LoadingSpinner message="Cargando datos..." height="h-screen" />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/reports"></BackButton>
        <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
          Tiempo para el armado del pedido:
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Aquí podrás visualizar cuánto tiempo lleva armar los pedidos realizados por los clientes.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AverageTimeOrderFilter
          idFilter={idFilter}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          onIdChange={setIdFilter}
          onStartDateChange={setStartDateFilter}
          onEndDateChange={setEndDateFilter}
          onSearch={handleSearch}
          onClear={handleClear}
          minDurationFilter={minDurationFilter}
          maxDurationFilter={maxDurationFilter}
          onMinDurationChange={setMinDurationFilter}
          onMaxDurationChange={setMaxDurationFilter}
        />
        <AverageTimeOrderTable data={filteredData} loading={loading} />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

       
      </div>
    </div>
  );
};

export default AverageTimeOrderPage;