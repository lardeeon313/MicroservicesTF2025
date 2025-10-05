import { DeliveryOperatorsInTeamDto } from './OperatorTypes';

export interface DeliveryTeamDto {
  id: number;
  teamName: string;
  teamDescription?: string;
  isActive: boolean;
  createdAt: string;
  operators: DeliveryOperatorsInTeamDto[];
  zoneAssignments: DeliveryZoneDto[];
}

export interface DeliveryZoneDto {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateDeliveryTeamRequest {
  teamName: string;
  teamDescription?: string;
}

export interface UpdateDeliveryTeamRequest {
  id: number;
  teamName: string;
  teamDescription?: string;
}

export interface CreateDeliveryZoneRequest {
  zoneName: string;
  zoneDescription?: string;
}

export interface UpdateDeliveryZoneRequest {
  id: number;
  zoneName: string;
  zoneDescription?: string;
}

