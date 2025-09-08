//Nueva interfaz que se asemeja a la esctructura que devuelve la api: 

import { DepotOrderMissingDTO } from "./Missing";

export interface DepotOrderDTO{
    depotOrderId: number;
    salesOrderId: number; 
    customerName: string; 
    customerEmail: string;
    phoneNumber: string; 
    deliveryDetail?: string | null;
    orderDate: string;
    status: number;
    totalAmount: number;
    items: DepotOrderItemDTO[];
    missings: DepotOrderMissingDTO[];
    assignedOperatorId?: string | null;
    assignedDepotTeam?: any | null; // DepotTeamEntity
    assignedDepotTeamId?: number | null;
}

//NUEVO STATUS SIMILAR AL ESTADO DE LOS PEDIDOS DENTRO DEL BACK 
export enum DepotOrderStatus{
    Received = 0,           // Recibido desde ventas
    ReReceived = 1,         // Re recibido desde ventas
    Assigned = 2,           // Asignado a operario
    InPreparation = 3,      // En preparación
    MissingProduct = 4,     // Notificado falta
    SentToBilling = 5,      // Enviado a facturar
    PendingResolution = 6,  // Pendiente de resolución
    Prepared = 7            // Preparado
}

//MAPEO NECESARIO POR QUE EL STATUS QUE SE RECIBE DEL BACK es tipo number 
export const OrderStatusMap: { [key: number]: DepotOrderStatus } = {
    0: DepotOrderStatus.Received,
    1: DepotOrderStatus.ReReceived,
    2: DepotOrderStatus.Assigned,
    3: DepotOrderStatus.InPreparation,
    4: DepotOrderStatus.MissingProduct,
    5: DepotOrderStatus.SentToBilling,
    6: DepotOrderStatus.PendingResolution,
    7: DepotOrderStatus.Prepared,
};


export interface OperatorDTO {
    //tiene que ser de tipo guid: 
    id: string; 
    depotTeamId: number; 
    roleInTeam: string; 
    assignedAt: string;
}


// Interfaz para los items de la orden
export interface DepotOrderItemDTO {
    id: number;
    productName: string;
    productBrand: string;
    packaging?: string | null; // Corresponde a PackagingType en el backend
    unitPrice?: number | null;
    quantity: number;
    total?: number | null;
    isReady: boolean; // Campo requerido según el backend
}

export interface DepotTeamAssigment{
    id: number; 
    depotTeamId:number; 
    depotTeamEntity: number; 
    OperatorUserId: string; 
    roleInTeam: string;
    assignedAt: string; 
}