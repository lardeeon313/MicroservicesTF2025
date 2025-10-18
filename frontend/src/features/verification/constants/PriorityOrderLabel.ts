import { DeliveryPriority } from '../types/OrderTypes';

export const DeliveryPriorityLabels: Record<DeliveryPriority, string> = {
  [DeliveryPriority.Low]: 'Baja',
  [DeliveryPriority.Medium]: 'Media',
  [DeliveryPriority.High]: 'Alta',
};
