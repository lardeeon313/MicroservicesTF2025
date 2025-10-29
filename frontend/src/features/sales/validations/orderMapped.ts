import { OrderTableData } from "../types/OrderTypes";

export function mapOrderToOrderTableData(order: any): OrderTableData {
  return {
    id: order.id,
    status: order.status,
    orderDate: order.orderDate,
    deliveryDate: order.deliveryDate,
    customerId: order.customerId,
    customerFirstName: order.customerFirstName,
    customerLastName: order.customerLastName,
    items: order.items,
    // 👇 Ajustamos acá
    deliveryAddress: order.address,
    paymentType: order.paymentType
  };
}
