
export interface DeliveryOperatorDto {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  fullName?: string;
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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  fullName?: string;
}

export interface AssignOperatorToTeamRequest {
  teamId: number;
  operatorUserId: string;
  roleInTeam?: string;
}

export interface AssignZoneToTeamRequest {
  teamId: number;
  zoneId: number;
}

