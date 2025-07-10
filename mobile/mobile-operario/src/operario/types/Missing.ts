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
    orderItemId: number;
    productName: string;
    productBrand: string;
    packaging?: string | null;
    quantity: number;
}

export interface DepotOrderMissingDTO {
    missingId: number;
    SalesOrderId: number;
    missingReason?: string | null;
    missingDescription?: string | null;
    descriptionResolution?: string | null;
    missingItems: DepotOrderMissingItem[];
    missingDate: string; // o Date
    DepotOrderId: number;
    DepotOrder: DepotOrderDTO;
}