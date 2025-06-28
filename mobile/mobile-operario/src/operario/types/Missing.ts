//faltante 
import type { OrderItem } from "../../otherTypes/OrderType";
import { DepotOrderDTO } from "./OrderDTO";

//Nueva interfaz ,es para el endpoint en el cual el operario de deposito le notifica el 
//faltante al encargado
export interface DepotOrderItemsReportedDto {
    orderItemId: number; 
    productName: string;
    productBrand: string; 
    packaning?: string | null; 
    quantity: number;
}
//ESTE ES EL REQUEST QUE SE COMUNICA CON EL ENDPOINT PARA EMITIR FALTANTE: 
export interface ReportOrderMissingRequest {
    depotOrderId: number;
    operatorUserId: string; //Guid
    salesOrderId: number;
    missingReason: string; 
    missingDescription: string; 
    missingItems: DepotOrderItemsReportedDto[];
}

export interface DepotOrderMissingItem {
    OrderItemId: number;
    ProductName: string;
    ProductBrand: string;
    Packaging?: string | null;
    Quantity: number;
}

export interface DepotOrderMissingDTO {
    MissingId: number;
    SalesOrderId: number;
    MissingReason?: string | null;
    MissingDescription?: string | null;
    DescriptionResolution?: string | null;
    MissingItems: DepotOrderMissingItem[];
    MissingDate: string; // o Date
    DepotOrderId: number;
    DepotOrder: DepotOrderDTO;
}