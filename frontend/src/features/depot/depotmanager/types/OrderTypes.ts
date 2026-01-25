import { DepotTeam } from './DepotTeamTypes';

export interface DepotOrderDto {
    depotOrderId: number;
    salesOrderId: number;
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    deliveryDetail?: string;
    deliveryDate?: Date;
    orderDate: Date;
    status: OrderStatus | string;
    totalAmount: number;
    // Relación con Items
    items: DepotOrderItemEntity[];
    // Relación con Faltantes
    missings: DepotOrderMissingDto[];
    assignedOperatorId?: string; // Guid como string
    operatorName: string;
    assignedDepotTeam?: DepotTeam;
    assignedDepotTeamId?: number;
    address?: OrderAddressDto;
    paymentType: PaymentType;

}

export interface OrderAddressEntity{
    id: number;
    street: string;
    number: string;
    apartment?: string;
    city: string;
    province: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
    createdAt: string;
    depotOrder?: any;
}

export interface OrderAddressDto{
    id: number;
    street: string;
    number: string;
    apartment?: string;
    city: string;
    province: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
}

export interface DepotOrderItemDto {
    id: number;
    productName: string;
    productBrand: string;
    packaging?: string;
    unitPrice?: number;
    quantity: number;
    total?: number; // Se puede calcular en frontend si es necesario
}

export interface DepotOrderItemsReportedDto {
    orderItemId: number;
    productName: string;
    productBrand: string;
    packaging?: string;
    quantity: number;
}

export interface DepotOrderMissingDto {
    missingId: number;
    salesOrderId: number;
    missingReason?: string;
    missingDescription?: string;
    descriptionResolution?: string;
    missingItems: DepotOrderMissingItem[];
    missingDate: Date;
    depotOrderId: number;
    depotOrder: DepotOrderEntity;
}

export interface DepotOrderMissingItem {
    depotOrderItemMissingId: number;
    salesOrderItemId: number,
    orderMissingId: number;
    depotOrderMissing: DepotOrderMissing;
    depotOrderItemId: number;
    depotOrderItem: DepotOrderItemEntity;
    productName: string;
    productBrand: string;
    packaging?: string;
    missingQuantity: number;
}

export interface DepotOrderItemEntity {
    id: number;
    depotOrderEntityId: number;
    depotOrderEntity: DepotOrderEntity;
    salesOrderItemId: number;
    productName: string;
    productBrand: string;
    packagingType?: string;
    unitPrice?: number;
    quantity: number;
    isReady: boolean;
    total?: number;
    depotOrderMissingId?: number;
    depotOrderMissing?: DepotOrderMissing;
}

export interface DepotOrderMissing {
    missingId: number;
    salesOrderId: number;
    missingReason?: string;
    missingDescription?: string;
    descriptionResolution?: string;
    missingItems: DepotOrderMissingItem[];
    missingDate: Date;
    depotOrderId: number;
    depotOrder: DepotOrderEntity;
}

export interface DepotOrderEntity {
    depotOrderId: number;
    salesOrderId: number;
    customerId: string; // Guid como string
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    deliveryDetail?: string;
    orderDate: Date;
    status: OrderStatus;
    paymentType: PaymentType;
    totalAmount: number;
    items: DepotOrderItemEntity[];
    missings: DepotOrderMissing[];
    assignedOperatorId?: string;
    assignedDepotTeam?: DepotTeam;
    assignedDepotTeamId?: number;
    rejectionReason?: string;
    deliveryAddressId: number;
    deliveryAddress: OrderAddressEntity;
}

// Mantener los valores numéricos alineados con el backend (DepotService.Domain.Enums.OrderStatus)
export enum OrderStatus {
    Received = 0,                 // Recibido desde ventas
    ReReceived = 1,               // Re recibido desde ventas
    Assigned = 2,                 // Asignado a operario
    InPreparation = 3,            // En preparación
    MissingProduct = 4,           // Notificado falta
    SentToBilling = 5,            // Enviado a facturar
    PendingResolution = 6,        // Pendiente de resolución
    Prepared = 7,                 // Preparado
    Invoiced = 8,                 // Facturado
    Issued = 9,                   // Emitido por ventas
    Cancelled = 10,               // Cancelado
    Deleted = 11,                 // Eliminado
    Verify = 12,                  // Verificado
    OnTheWay = 13,                // En camino
    Delivered = 14,               // Entregado
    PendingVerification = 15,     // Pendiente de verificación
    AssignedDelivery = 16,        // Asignado a reparto
    PendingDelivered = 17,        // Pendiente de reparto
    PendingIncidentResolution = 18, // Pendiente de resolución de incidente
    IncidentResolved = 19         // Incidente resuelto
}

// Tipo para compatibilidad con componentes de tabla
export interface OrderTableData {
    id: number;
    status: OrderStatus | string;
    orderDate: string;
    deliveryDate?: string;
    deliveryDetail: string;
    customerFirstName?: string;
    customerLastName?: string;
    operatorName?: string;
    address?: OrderAddressDto;
    items: {
        productName: string;
        productBrand: string;
        quantity: number;
    }[];
}

//TIPOS DE PAGO: 
export enum PaymentType {
  Transfer = "Transfer",
  Credit_Card = "Credit_Card",
  Debit_Card = "Debit_Card",
  Cash = "Cash",
  Current_Account = "Current_Account",
  Check = "Check",
  Promissory_Note = "Promissory_Note",
}

