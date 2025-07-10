import { DepotTeam } from './DepotTeamTypes';

export interface DepotOrderDto {
    DepotOrderId: number;
    SalesOrderId: number;
    CustomerName: string;
    CustomerEmail: string;
    PhoneNumber: string;
    DeliveryDetail?: string;
    OrderDate: Date;
    Status: OrderStatus;
    TotalAmount: number;
    // Relación con Items
    Items: DepotOrderItemEntity[];
    // Relación con Faltantes
    Missings: DepotOrderMissingDto[];
    AssignedOperatorId?: string; // Guid como string
    AssignedDepotTeam?: DepotTeam;
    AssignedDepotTeamId?: number;
}

export interface DepotOrderItemDto {
    Id: number;
    ProductName: string;
    ProductBrand: string;
    Packaging?: string;
    UnitPrice?: number;
    Quantity: number;
    Total?: number; // Se puede calcular en frontend si es necesario
}

export interface DepotOrderItemsReportedDto {
    OrderItemId: number;
    ProductName: string;
    ProductBrand: string;
    Packaging?: string;
    Quantity: number;
}

export interface DepotOrderMissingDto {
    MissingId: number;
    SalesOrderId: number;
    MissingReason?: string;
    MissingDescription?: string;
    DescriptionResolution?: string;
    MissingItems: DepotOrderMissingItem[];
    MissingDate: Date;
    DepotOrderId: number;
    DepotOrder: DepotOrderEntity;
}

export interface DepotOrderMissingItem {
    Id: number;
    OrderMissingId: number;
    DepotOrderMissing: DepotOrderMissing;
    DepotOrderItemId: number;
    DepotOrderItem: DepotOrderItemEntity;
    ProductName: string;
    ProductBrand: string;
    Packaging?: string;
    MissingQuantity: number;
}

export interface DepotOrderItemEntity {
    Id: number;
    DepotOrderEntityId: number;
    DepotOrderEntity: DepotOrderEntity;
    SalesOrderItemId: number;
    ProductName: string;
    ProductBrand: string;
    PackagingType?: string;
    UnitPrice?: number;
    Quantity: number;
    IsReady: boolean;
    Total?: number;
    DepotOrderMissingId?: number;
    DepotOrderMissing?: DepotOrderMissing;
}

export interface DepotOrderMissing {
    MissingId: number;
    SalesOrderId: number;
    MissingReason?: string;
    MissingDescription?: string;
    DescriptionResolution?: string;
    MissingItems: DepotOrderMissingItem[];
    MissingDate: Date;
    DepotOrderId: number;
    DepotOrder: DepotOrderEntity;
}

export interface DepotOrderEntity {
    DepotOrderId: number;
    SalesOrderId: number;
    CustomerId: string; // Guid como string
    CustomerName: string;
    CustomerEmail: string;
    PhoneNumber: string;
    DeliveryDetail?: string;
    OrderDate: Date;
    Status: OrderStatus;
    TotalAmount: number;
    Items: DepotOrderItemEntity[];
    Missings: DepotOrderMissing[];
    AssignedOperatorId?: string;
    AssignedDepotTeam?: DepotTeam;
    AssignedDepotTeamId?: number;
    RejectionReason?: string;
}

export enum OrderStatus {
    Pending = "pending",
    Issued = "issued",
    Confirmed = "confirmed",
    InPreparation = "inPreparation",
    Prepared = "prepared",
    Invoiced = "invoiced",   
    Verify = "verify",
    OnTheWay = "onTheWay",   
    Delivered = "delivered",  
    Canceled = "canceled"
}

// Tipo para compatibilidad con componentes de tabla
export interface OrderTableData {
    id: number;
    status: OrderStatus;
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
