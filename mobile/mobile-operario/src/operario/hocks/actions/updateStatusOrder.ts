
import { DepotOrderStatus } from '../../types/OrderDTO';
import type { DepotOrderDTO } from '../../types/OrderDTO';

export const actualizarEstadoPedido = (order: DepotOrderDTO, accion: 'aceptado' | 'rechazado') => {
  if (accion === 'aceptado') {
    order.status = DepotOrderStatus.InPreparation;
  } else if (accion === 'rechazado') {
    order.status = DepotOrderStatus.Assigned;
  }
};
 
export const actualizarEstadoPedidoFaltante = (order: DepotOrderDTO): DepotOrderDTO  => {
  return{
    ...order,
    status: DepotOrderStatus.MissingProduct,
  }
}