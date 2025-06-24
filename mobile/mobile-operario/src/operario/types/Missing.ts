//faltante 
import type { OrderItem } from "../../otherTypes/OrderType";

export interface Missing{
    id:number;
    product: OrderItem;
    notifyMissing : (description:string) => Notification;
}

export interface Notification {
    missingDate: Date;
    missingTimeUtc : Date; 
    description: string; 
}



//Nueva interfaz ,es para el endpoint en el cual el operario de deposito le notifica el 
//faltante al encargado
export interface DepotOrderItemsReportedDto {
    OrderItemId: number; 
    ProductName: string;
    ProductBrand: string; 
    Packaning?: string | null; 
    Quantity: number;
}

export interface DepotOrderMissingDto {
    DepotOrderId: number;
    MissingReason: string; 
    MissingDescription: string; 
    MissingItems: DepotOrderItemsReportedDto[];
}