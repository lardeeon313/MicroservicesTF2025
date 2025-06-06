export interface DepotTeam {
  id: number;
  teamName: string;
  teamDescription?: string | null;
  assignments: DepotTeamAssignment[];
  createdAt: string;
}

export interface DepotTeamAssignment {
  operatorUserId: string; // Guid string
  roleInTeam: string;
  assignedAt: string;
}

export interface DepotTeamCreateDTO {
  teamName: string;
  teamDescription?: string;
}

export interface DepotTeamUpdateDTO {
  teamName: string;
  teamDescription?: string;
}

export interface AssignOperatorDTO {
  operatorUserId: string;
}