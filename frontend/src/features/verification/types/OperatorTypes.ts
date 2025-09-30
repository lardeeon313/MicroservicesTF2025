
export interface DeliveryOperatorDto {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface DeliveryOperatorsInTeamDto {
  operatorByUserId: string;
  roleInTeam: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  assignAt: string;
}

// ========== OPERATOR SERVICE TYPES ==========

export interface OperatorDto {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
}

export interface AssignOperatorRequest {
  teamId: number;
  operatorUserId: string;
  roleInTeam: string;
}

export interface RemoveOperatorRequest {
  operatorUserId: string;
  teamId: number;
}

