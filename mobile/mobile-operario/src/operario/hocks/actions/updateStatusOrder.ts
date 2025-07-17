// actualizarEstadoPedido.ts
import { Alert } from 'react-native';
//import { OrderStatus, type Order } from '../../../otherTypes/OrderType';
import { DepotOrderStatus } from '../../types/OrderDTO';
import type { DepotOrderDTO } from '../../types/OrderDTO';
//cambia el estado si lo rechaza o lo acepta 
export const actualizarEstadoPedido = (order: DepotOrderDTO, accion: 'aceptado' | 'rechazado') => {
  if (accion === 'aceptado') {
    order.status = DepotOrderStatus.InPreparation;
  } else if (accion === 'rechazado') {
    order.status = DepotOrderStatus.Assigned;
  }
};

//cambia el estado si se emitio un faltante de tal pedido en especifico 
export const actualizarEstadoPedidoFaltante = (order: DepotOrderDTO): DepotOrderDTO  => {
  return{
    ...order,
    status: DepotOrderStatus.MissingProduct,
  }
}