// src/hooks/useTeams.ts
import { useState, useEffect, useCallback } from "react";
import { DepotTeamUpdateDTO } from "../types/DepotTeamTypes";
import { teamService } from "../services/teamService";

export function useTeams() {
  const [teams, setTeams] = useState<DepotTeamUpdateDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (err) {
      setError("Error cargando equipos");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTeam = async (team: DepotTeamUpdateDTO) => {
    await teamService.updateTeam(team);
    await fetchTeams();
  };

  const createTeam = async (teamName: string) => {
    await teamService.createTeam(teamName);
    await fetchTeams();
  };

  const assignOperator = async (teamId: number, operatorUserId: string) => {
    await teamService.assignOperator(teamId, operatorUserId);
    await fetchTeams();
  };

  const removeOperator = async (teamId: number, operatorUserId: string) => {
    await teamService.removeOperator(teamId, operatorUserId);
    await fetchTeams();
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    loading,
    error,
    fetchTeams,
    updateTeam,
    createTeam,
    assignOperator,
    removeOperator,
  };
}

