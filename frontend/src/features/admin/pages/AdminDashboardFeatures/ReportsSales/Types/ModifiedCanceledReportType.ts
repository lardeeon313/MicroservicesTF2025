export enum ModifiedCanceledOrderStatus {
  Pending = "Pending",
  PendingResolution = "PendingResolution",
  PendingReissued = "PendingReissued",
  ReIssued = "ReIssued",
  Canceled = "Canceled",
}

export interface ModifiedCanceledOrder {
  orderId: number;
  customerFullName: string;
  orderDate: string;
  modifiedDate?: string;
  status: ModifiedCanceledOrderStatus;
}

export interface ModifiedCanceledOrderPagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ModifiedCanceledFilters {
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: ModifiedCanceledOrderStatus;
}

export type ModifiedFilterStatus = ModifiedCanceledOrderStatus | "Todos";
