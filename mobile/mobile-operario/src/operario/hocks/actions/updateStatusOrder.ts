// actualizarEstadoPedido.ts
import { Alert } from 'react-native';
import { OrderStatus, type Order } from '../../../otherTypes/OrderType';

export const actualizarEstadoPedido = (order: Order, accion: 'aceptado' | 'rechazado') => {
  if (accion === 'aceptado') {
    order.status = OrderStatus.Confirmed;
    Alert.alert('Pedido confirmado', `El pedido ${order.id} ha sido confirmado.`);
  } else if (accion === 'rechazado') {
    order.status = OrderStatus.Pending;
    Alert.alert('Pedido rechazado', `El pedido ${order.id} ha sido rechazado.`);
  }
};
