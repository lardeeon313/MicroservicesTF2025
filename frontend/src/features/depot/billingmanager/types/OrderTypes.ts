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

export interface DepotOrderItemDto {
    id: number;
    productBrand: string;
    productName: string;
    packaging?: string;
    unitPrice?: number;
    quantity: number;
    total: number;
}

export interface DepotOrderDto {
    depotOrderId: number;
    salesOrderId: number;
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    deliveryDetail?: string;
    orderDate: string; // ISO string
    status: OrderStatus | string;
    items: DepotOrderItemDto[];
    totalAmount: number;
}

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