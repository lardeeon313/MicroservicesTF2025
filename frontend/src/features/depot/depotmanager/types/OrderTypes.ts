import { DepotTeam } from './DepotTeamTypes';

export interface DepotOrderDto {
    depotOrderId: number;
    salesOrderId: number;
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    deliveryDetail?: string;
    orderDate: Date;
    status: OrderStatus | string;
    totalAmount: number;
    // Relación con Items
    items: DepotOrderItemEntity[];
    // Relación con Faltantes
    missings: DepotOrderMissingDto[];
    assignedOperatorId?: string; // Guid como string
    assignedDepotTeam?: DepotTeam;
    assignedDepotTeamId?: number;
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
    id: number;
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
    totalAmount: number;
    items: DepotOrderItemEntity[];
    missings: DepotOrderMissing[];
    assignedOperatorId?: string;
    assignedDepotTeam?: DepotTeam;
    assignedDepotTeamId?: number;
    rejectionReason?: string;
}

export enum OrderStatus {
    Pending = "pending",
    ReReceived = "reReceived",
    Issued = "issued",
    Confirmed = "confirmed",
    InPreparation = "inPreparation",
    Prepared = "prepared",
    Invoiced = "invoiced",   
    Verify = "verify",
    OnTheWay = "onTheWay",   
    Delivered = "delivered",  
    Canceled = "canceled",
    Assigned = "assigned"
}

// Tipo para compatibilidad con componentes de tabla
export interface OrderTableData {
    id: number;
    status: OrderStatus | string;
    orderDate: string;
    deliveryDate?: string;
    deliveryDetail?: string;
    customerFirstName?: string;
    customerLastName?: string;
    items: {
        productName: string;
        productBrand: string;
        quantity: number;
    }[];
}
