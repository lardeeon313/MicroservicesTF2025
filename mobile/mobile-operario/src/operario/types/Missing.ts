//faltante 
import type { OrderItem } from "../../otherTypes/OrderType";
import { DepotOrderDTO } from "./OrderDTO";

//Nueva interfaz ,es para el endpoint en el cual el operario de deposito le notifica el 
//faltante al encargado
export interface DepotOrderItemsReportedDto {
    orderItemId: number; 
    productName: string;
    productBrand: string; 
    packaging?: string | null;
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
    id: number;
    depotOrderItemId: number;
    productName: string;
    productBrand: string;
    packaging?: string | null;
    missingQuantity: number; // Corresponde a MissingQuantity en el backend
}

export interface DepotOrderMissingDTO {
    missingId: number;
    salesOrderId: number; // Corregido: SalesOrderId -> salesOrderId
    missingReason?: string | null;
    missingDescription?: string | null;
    descriptionResolution?: string | null;
    missingItems: DepotOrderMissingItem[];
    missingDate: string; // o Date
    depotOrderId: number; // Corregido: DepotOrderId -> depotOrderId
    depotOrder: DepotOrderDTO; // Corregido: DepotOrder -> depotOrder
}