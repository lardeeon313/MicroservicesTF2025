export interface OperatorInTeam {
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