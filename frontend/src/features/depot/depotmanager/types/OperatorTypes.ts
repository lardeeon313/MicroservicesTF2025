import { DepotOrderItemsReportedDto } from './OrderTypes';

export interface OperatorInTeamDto {
    operatorByUserId: string;
    operatorName: string;
    operatorLastName: string;
    operatorEmail: string;
    roleInTeam: string;
    assignAt: Date;
}

export interface OperatorDto {
    id: string;
    fullName: string;
    email: string;
}

export interface AssignOperatorResponse {
    teamId: number;
    operatorUserId: string;
    assignedAt: Date;
}

export interface AssignOperatorRequest {
    teamId: number;
    operatorUserId: string;
}

export interface AssignOrderResponse {
    OrderId: number;
    OperatorId: string;
    AssignedAt: Date;
}

export interface AssignOrderRequest {
    /** Identificador de la orden de depósito que se asignará al equipo. */
    DepotOrderId: number;
    /** Identificador del operador al que se asignará la orden de depósito. */
    OperatorUserId: string;
}

export interface OrderMissingReportedRequest {
    DepotOrderId: number;
    MissingReason: string;
    MissingDescription: string;
    MissingItems: DepotOrderItemsReportedDto[];
}

