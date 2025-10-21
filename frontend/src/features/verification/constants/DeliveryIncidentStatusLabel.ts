import { DeliveryIncidentStatus } from '../types/OrderTypes';

export const DeliveryIncidentStatusLabels: Record<DeliveryIncidentStatus, string> = {
  [DeliveryIncidentStatus.Open]: 'Abierto',
  [DeliveryIncidentStatus.InProgress]: 'En progreso',
  [DeliveryIncidentStatus.Resolved]: 'Resuelto',
  [DeliveryIncidentStatus.Closed]: 'Cerrado',
};
