import { OperatorInTeamDto } from './OperatorTypes';

export interface DepotTeam {
    id: number;
    teamName: string;
    teamDescription: string;
    operators: OperatorInTeamDto[];
}

// Exportar el tipo Operator para que esté disponible
export type Operator = OperatorInTeamDto;

export interface CreateTeamResponse {
  teamId: number;
  teamName: string;
  teamDescription?: string;
  createdAt: Date;
}

export interface UpdateTeamResponse {
  teamId: number;
  teamName: string;
  teamDescription?: string;
} 

export interface CreateTeamRequest {
  teamName: string;
  teamDescription: string;
}

export interface UpdateTeamRequest {
  teamId: number;
  teamName: string;
  teamDescription: string;
}