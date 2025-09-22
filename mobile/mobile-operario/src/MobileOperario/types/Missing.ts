import { DepotOrderDTO } from "./OrderDTO";


export interface DepotOrderItemsReportedDto {
    orderItemId: number; 
    productName: string;
    productBrand: string; 
    packaning?: string | null; 
    quantity: number;
}
 
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