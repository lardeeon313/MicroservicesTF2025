export const OrderStatusLabels: Record<string, string> = {
  Pending: "Pendiente",
  Issued: "Emitido",
  Confirmed: "Confirmado por depósito",
  InPreparation: "En preparación",
  Prepared: "Preparado",
  SentToBilling: "Enviado a facturar",
  Invoiced: "Facturado",
  Verified: "Verificado",
  OnTheWay: "En camino",
  Delivered: "Entregado",
  Canceled: "Cancelado por ventas",
  PendingResolution: "Pendiente de resolución",
  ReIssued: "Reemitido",
  PendingReissued: "Pendiente de reemisión",
  PendingVerification: "Pendiente de verificación",
  PendingDelivery: "Pendiente de reparto",
  AssignmentCancelled: "Asignación cancelada",
  AssignedDelivery: "Asignado a reparto",
  PendingCashVerification: "Efectivo pendiente de verificación",
  CashVerified: "Efectivo verificado",
  PendingIncidentResolution: "Pendiente de resolución de incidente",
  IncidentResolved: "Incidente resuelto",
};

export const OrderStatusEnum: Record<string, number> = {
  Pending: 0,
  Issued: 1,
  Confirmed: 2,
  InPreparation: 3,
  Prepared: 4,
  SentToBilling: 5,
  Invoiced: 6,
  Verified: 7,
  OnTheWay: 8,
  Delivered: 9,
  Canceled: 10,
  PendingResolution: 11,
  ReIssued: 12,
  PendingReissued: 13,
  PendingVerification: 14,
  PendingDelivery: 15,
  AssignmentCancelled: 16,
  AssignedDelivery: 17,
  PendingCashVerification: 18,
  CashVerified: 19,
  PendingIncidentResolution: 20,
  IncidentResolved: 21,
};

import { useState, useEffect } from "react";
import API from "../../../../../../api/axios";
import { OrderStatusHistoryFilter } from "../../../../types/FilterReports/FilterReportsEntity";
import { OrderStatusHistoryReport, PagedResponse } from "../../../../types/Report";

export const useOrderStatusHistoryReport = () => {
  const [filters, setFilters] = useState<OrderStatusHistoryFilter>({});
  const [data, setData] = useState<OrderStatusHistoryReport[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const buildCleanParams = (
    rawFilters: OrderStatusHistoryFilter,
    pageNumber: number,
    pageSize: number
  ) => {
    const params: Record<string, any> = {
      pageNumber,
      pageSize,
    };

    if (rawFilters.startDate)
      params.startDate = new Date(rawFilters.startDate).toISOString();

    if (rawFilters.endDate)
      params.endDate = new Date(rawFilters.endDate).toISOString();

    
    if (rawFilters.oldStatus) params.oldStatus = rawFilters.oldStatus;
    if (rawFilters.newStatus) params.newStatus = rawFilters.newStatus;

    if (rawFilters.operatorId) params.operatorId = rawFilters.operatorId;

    return params;
  };

  const fetchData = async (pageNumber?: number) => {
    setLoading(true);
    try {
      const page = pageNumber ?? pagination.pageNumber;
      const params = buildCleanParams(filters, page, pagination.pageSize);

      

      const response = await API.get<PagedResponse<OrderStatusHistoryReport>>(
        "/logistic/LogisticReport/order-status-history",
        { params }
      );

      setData(response.data.items);
      setPagination({
        totalCount: response.data.totalCount,
        pageNumber: response.data.pageNumber,
        pageSize: response.data.pageSize,
        totalPages: response.data.totalPages,
      });
    } catch (error: any) {
      console.error("[OrderStatusHistory] ERROR:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [filters]);

  return {
    data,
    loading,
    filters,
    setFilters,
    fetchData,
    pagination,
    setPagination,
  };
};
