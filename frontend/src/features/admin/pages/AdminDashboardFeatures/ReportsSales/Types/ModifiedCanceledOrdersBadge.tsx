import React from "react";
import { ModifiedCanceledOrderStatus } from "./ModifiedCanceledReportType";

//BADGE NUEVO UNICAMENTE PARA ESTE REPORTE :


type Props = {
  status: ModifiedCanceledOrderStatus;
};

const STATUS_STYLES: Record<ModifiedCanceledOrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  PendingResolution: "bg-orange-100 text-orange-800",
  PendingReissued: "bg-sky-100 text-sky-800",
  ReIssued: "bg-green-100 text-green-800",
  Canceled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<ModifiedCanceledOrderStatus, string> = {
  Pending: "Pendiente",
  PendingResolution: "Pendiente resolución",
  PendingReissued: "Pendiente reemitir",
  ReIssued: "Reemitido",
  Canceled: "Cancelado",
};

export const ModifiedCanceledOrderStatusBadge: React.FC<Props> = ({
  status,
}) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
};


export function mapStatusModifiedCanceledOrdersBadge(
  status: string
): ModifiedCanceledOrderStatus {
  switch (status) {
    case "pending":
      return ModifiedCanceledOrderStatus.Pending;

    case "pendingResolution":
      return ModifiedCanceledOrderStatus.PendingResolution;

    case "pendingReissued":
      return ModifiedCanceledOrderStatus.PendingReissued;

    case "reIssued":
      return ModifiedCanceledOrderStatus.ReIssued;

    case "canceled":
      return ModifiedCanceledOrderStatus.Canceled;

    default:
      return ModifiedCanceledOrderStatus.Pending;
  }
}
