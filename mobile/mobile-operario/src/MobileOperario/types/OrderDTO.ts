
import { DepotOrderMissingDTO } from "./Missing";

export interface DepotOrderDTO{
    depotOrderId: number;
    salesOrderId: number; 
    customerName: string; 
    customerEmail: string;
    phoneNumber: string; 
    deliveryDetail: string; 
    orderDate: string;
    status: number;
 
    assignedOperatorId: string; 
    assignedDepotTeamId: number | null; 
    rejectionReason?:string | null; 
    items : any[];
    missings: DepotOrderMissingDTO[];
    address?: OrderAddressDTO | null;
}

export interface OrderAddressDTO{
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

export interface OrderAddressEntity{
    id: number;

    // Información básica de la dirección
    street: string;        // Calle
    number: string;        // Altura / numeración
    apartment?: string;    // Depto, piso, etc.
    // Jerarquía de ubicación
    city: string;
    province: string;
    country: string;
    postalCode?: string;
    // Para integración con Google Maps
    latitude?: number;
    longitude?: number;
    formattedAddress?: string; // lo que devuelva Google Maps al validar

    // Auditoría
    createdAt: string; // En frontend, DateTime se maneja como string (ISO date)

    // Navegación inversa (solo si lo necesitás)
    // depotOrder?: DepotOrderDto;
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


export interface DepotTeamAssigment{
    id: number; 
    depotTeamId:number; 
    depotTeamEntity: number; 
    OperatorUserId: string; 
    roleInTeam: string;
    assignedAt: string; 
}