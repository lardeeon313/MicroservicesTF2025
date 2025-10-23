export interface ConfirmAssignedOrderRequest{
    logisticOrderId: number;
    operatorUserId: string;
}

export interface RejectAssingOrderRequest{
    logisticOrderId: number;
    operatorUserId:string; 
    reason: string; 
}

export interface MarkOrderOnTheWayRequest {
    logisticOrderId: number; 
    operatorUserId: string; 
}

export interface ReportDeliveryIncidentRequest {
    logisticOrderId: number;
    operatorUserId: string; 
    incidentType: string; 
    description : string; 
}

export interface ResolveDeliveryIncidentRequest {
    incidentId: number; 
    logisticOrderId: number; 
    resolutionStatus: string; 
    resolutionNotes: string; 
}

