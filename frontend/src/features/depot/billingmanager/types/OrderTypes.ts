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
    packaging?: string | null;
    unitPrice?: number | null;
    quantity: number;
    total: number;
}

export interface BillingAddressEntity{
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

export interface BillingAddressDto{
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

export interface DepotOrderDto {
    depotOrderId: number;
    salesOrderId: number;
    customerName: string;
    customerEmail: string;
    phoneNumber: string;
    deliveryDetail?: string | null;
    orderDate: string; // ISO string
    status: OrderStatus | string | number;
    items: DepotOrderItemDto[];
    totalAmount: number;
    address?: BillingAddressDto;
}

export interface OrderTableData {
    id: number;
    status: OrderStatus | string;
    orderDate: string;
    deliveryDate?: string;
    deliveryDetail?: string;
    customerFirstName?: string;
    customerLastName?: string;
    address?: BillingAddressDto;
    items: {
        productName: string;
        productBrand: string;
        quantity: number;
    }[];
}