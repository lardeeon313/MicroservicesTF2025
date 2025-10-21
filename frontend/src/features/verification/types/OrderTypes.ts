import { LogisticCustomerDto } from './CustomerType';
import { LogisticAddressDto } from './Address';
import { DeliveryTeamDto, DeliveryZoneDto } from './DeliveryTeamTypes';

// Enums
export enum OrderStatus {
  Pending = 0, // Pendiente
  Issued = 1, // Emitido
  Confirmed = 2, // Confirmado por depósito
  InPreparation = 3, // En preparacion
  Prepared = 4, // Preparado
  SentToBilling = 5, // Enviado a facturar
  Invoiced = 6, // Facturado
  Verified = 7, // Verificado
  OnTheWay = 8, // En camino
  Delivered = 9, // Entregado
  Canceled = 10, // Cancelado por ventas
  PendingResolution = 11, // Pendiente de resolución
  ReIssued = 12, // Reemitido
  PendingReissued = 13, // Pendiente de reemisión
  PendingVerification = 14, // Pendiente de verificación
  PendingDelivery = 15, // Pendiente de reparto
  AssignmentCancelled = 16, // Asignación cancelada
  AssignedDelivery = 17, // Asignado a reparto
  PendingCashVerification = 18, // Efectivo pendiente de verificacion
  CashVerified = 19, // Efectivo Verificado
  PendingIncidentResolution = 20, // Pendiente de resolución de incidente
  IncidentResolved = 21, // Incidente resuelto
}

export enum DeliveryPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum PaymentType {
  Transfer = "Transferencia",
  Credit_Card = "Tarjeta de Credito",
  Debit_Card = "Tarjeta de Debito",
  Cash = "Efectivo",
  Current_Account = "Cuenta Corriente",
  Check = "Cheque",
  Promissory_Note = "Pagaré",
}

export enum DeliveryIncidentStatus {
  Open = 0, // Abierto
  InProgress = 1, // En progreso
  Resolved = 2, // Resuelto
  Closed = 3, // Cerrado
}

// Main Order DTO
export interface LogisticOrderDto {
  id: number;
  status: OrderStatus;
  deliveryPriority?: DeliveryPriority;
  orderDate: string; // ISO date string
  deliveryDate?: string; // ISO date string
  modifiedStatusDate?: string; // ISO date string
  totalAmount?: number;
  paymentReceipt?: string;
  deliveryDetail?: string;
  paymentType?: PaymentType;
  customer?: LogisticCustomerDto;
  items: LogisticOrderItemDto[];
  assignedOperatorId?: string; // GUID as string
  assignedDeliveryTeam: DeliveryTeamDto;
  assignedDeliveryZone: DeliveryZoneDto;
  deliveryAddress?: LogisticAddressDto;
  statusHistory: LogisticOrderStatusHistoryDto[];
  rejectionReasons: DeliveryRejectionReasonDto[];
  deliveryIncidents: DeliveryIncidentDto[];
  depotOrderId: number;
  salesOrderId: number;
}

// Order Item DTO
export interface LogisticOrderItemDto {
  id: number;
  productName?: string;
  productBrand?: string;
  quantity: number;
  packagingType?: string;
  unitPrice?: number;
  total: number;
}

// Order Status History DTO
export interface LogisticOrderStatusHistoryDto {
  id: number;
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  changedAt: string; // ISO date string
  averageDuration: number; // Tiempo promedio de procesamiento del pedido en segundos
}

// Delivery Incident DTO
export interface DeliveryIncidentDto {
  id: number;
  logisticOrderId: number;
  reportedByOperatorId: string; // GUID as string
  incidentType: string;
  description: string;
  reportedAt: string; // ISO date string
  resolved: boolean;
  resolvedAt?: string; // ISO date string
  resolutionNote?: string;
  deliveryIncidentStatus: DeliveryIncidentStatus;
}

// Delivery Rejection Reason DTO
export interface DeliveryRejectionReasonDto {
  id: number;
  logisticOrderId: number;
  deliveryOperatorId: string; // GUID as string
  reason: string;
  rejectedAt: string; // ISO date string
}

// Paged Orders DTO
export interface LogisticPagedOrderDto {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  orders: LogisticOrderDto[];
}

// Request DTOs
export interface SetPriorityRequest {
  logisticOrderId: number;
  deliveryPriority: DeliveryPriority;
}

export interface AssignOperatorRequest {
  /**
   * Identificador de la orden de depósito que se asignará al equipo.
   */
  logisticOrderId: number;
  /**
   * Identificador del operador al que se asignará la orden de depósito.
   */
  operatorUserId: string; // GUID as string
}

export interface RemoveAssignOperatorRequest {
  /**
   * Request para remover la asignación de una orden a un operario.
   */
  logisticOrderId: number;
  /**
   * Identificador del operador al que se asignará la orden de depósito.
   */
  operatorUserId: string; // GUID as string
}

export interface ReportIncidentRequest {
  logisticOrderId: number;
  incidentType: string;
  description: string;
  reportedByOperatorId: string; // GUID as string
}

export interface ResolveIncidentRequest {
  incidentId: number;
  resolutionNote: string;
  resolvedByOperatorId: string; // GUID as string
}

export interface RejectOrderRequest {
  logisticOrderId: number;
  reason: string;
  deliveryOperatorId: string; // GUID as string
}