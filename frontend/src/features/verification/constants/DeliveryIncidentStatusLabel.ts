import { DeliveryIncidentStatus } from '../types/OrderTypes';

export const DeliveryIncidentStatusLabels: Record<DeliveryIncidentStatus, string> = {
  [DeliveryIncidentStatus.Pending]: 'Pendiente',
  [DeliveryIncidentStatus.Resolved]: 'Resuelto',
  [DeliveryIncidentStatus.Delivered]: 'Entregado',
};