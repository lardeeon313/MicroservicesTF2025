import API from "../../../api/axios";
import {CreateDeliveryTeamRequest,UpdateDeliveryTeamRequest,CreateDeliveryZoneRequest,UpdateDeliveryZoneRequest,DeliveryTeamDto,DeliveryZoneDto
} from "../types/DeliveryTeamTypes";

// ========== TEAM OPERATIONS ==========

// Crear un nuevo equipo de entrega
export const createTeam = async (data: CreateDeliveryTeamRequest): Promise<void> => {
  const requestData = {
    TeamName: data.teamName,
    TeamDescription: data.teamDescription
  };
  await API.post("/logistic/VerificationManager/create-team", requestData);
};

// Actualizar un equipo de entrega
export const updateTeam = async (teamId: number, data: UpdateDeliveryTeamRequest): Promise<void> => {
  const requestData = {
    Id: data.id,
    TeamName: data.teamName,
    TeamDescription: data.teamDescription
  };
  await API.put(`/logistic/VerificationManager/update-team/${teamId}`, requestData);
};

// Inhabilitar un equipo de entrega
export const disableTeam = async (teamId: number): Promise<void> => {
  await API.put(`/logistic/VerificationManager/disable-team/${teamId}`);
};

// Activar un equipo de entrega
export const activateTeam = async (teamId: number): Promise<void> => {
  await API.put(`/logistic/VerificationManager/active-team/${teamId}`);
};

// Eliminar un equipo de entrega
export const deleteTeam = async (teamId: number): Promise<void> => {
  await API.delete(`/logistic/VerificationManager/delete-team/${teamId}`);
};

// Obtener todos los equipos de entrega
export const getAllTeams = async (): Promise<DeliveryTeamDto[]> => {
  const response = await API.get("/logistic/VerificationManager/get-all-teams");
  return response.data;
};

// Obtener un equipo por su ID
export const getTeamById = async (teamId: number): Promise<DeliveryTeamDto> => {
  const response = await API.get(`/logistic/VerificationManager/get-team-by-id/${teamId}`);
  return response.data;
};

// ========== ZONE OPERATIONS ==========

// Crear una nueva zona de entrega
export const createZone = async (data: CreateDeliveryZoneRequest): Promise<DeliveryZoneDto> => {
  const requestData = {
    ZoneName: data.zoneName,
    ZoneDescription: data.zoneDescription
  };
  const response = await API.post("/logistic/VerificationManager/create-zone", requestData);
  return response.data;
};

// Actualizar una zona de entrega
export const updateZone = async (zoneId: number, data: UpdateDeliveryZoneRequest): Promise<boolean> => {
  const requestData = {
    Id: data.id,
    ZoneName: data.zoneName,
    ZoneDescription: data.zoneDescription
  };
  const response = await API.put(`/logistic/VerificationManager/update-zone/${zoneId}`, requestData);
  return response.data;
};

// Inhabilitar una zona de entrega
    export const disableZone = async (zoneId: number): Promise<void> => {
    await API.put(`/logistic/VerificationManager/disable-zone/${zoneId}`);
};

// Activar una zona de entrega
export const activateZone = async (zoneId: number): Promise<void> => {
  await API.put(`/logistic/VerificationManager/active-zone/${zoneId}`);
};

// Eliminar una zona de entrega
export const deleteZone = async (zoneId: number): Promise<boolean> => {
  const response = await API.delete(`/logistic/VerificationManager/delete-zone/${zoneId}`);
  return response.data;
};

// Obtener todas las zonas de entrega
export const getAllZones = async (): Promise<DeliveryZoneDto[]> => {
  const response = await API.get("/logistic/VerificationManager/get-all-zones");
  return response.data;
};

// Obtener una zona por su ID
export const getZoneById = async (zoneId: number): Promise<DeliveryZoneDto> => {
  const response = await API.get(`/logistic/VerificationManager/get-zone-by-id/${zoneId}`);
  return response.data;
};