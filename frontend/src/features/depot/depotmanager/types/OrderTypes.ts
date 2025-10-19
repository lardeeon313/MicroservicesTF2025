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

export enum OrderStatus {
    /*
    Pending = "pending",
    ReReceived = "reReceived",
    Issued = "issued",
    Confirmed = "confirmed",
    InPreparation = "inPreparation",
    PendingResolution = "pendingResolution",
    MissingProduct = "missingProduct",
    Prepared = "prepared",
    Invoiced = "invoiced",   
    Verify = "verify",
    OnTheWay = "onTheWay",   
    Delivered = "delivered",  
    Canceled = "canceled",
    Assigned = "assigned"
    */
    Received = 0,
    ReReceived = 1,
    Assigned = 2,
    InPreparation = 3,
    MissingProduct = 4,
    SentToBilling = 5,
    PendingResolution = 6,
    Prepared = 7,
    Invoiced = 8,
    Issued = 9,
    Cancelled = 10,
    Deleted = 11
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

