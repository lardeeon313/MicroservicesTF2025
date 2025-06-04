import { OrderStatus } from "../../otherTypes/OrderType";
import type { Order } from "../../otherTypes/OrderType";

export const mockOrders: Order[] = [
  {
    id: 1,
    customerId: 'c1',
    customer: {
      id: 'c1',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@correo.com',
      phoneNumber: '12345678',
      address: 'Calle Falsa 123',
      registrationDate: '2024-10-10T00:00:00Z',
    },
    status: OrderStatus.Pending,
    orderDate: new Date().toISOString(),
    items: [],
  },
  {
    id: 2,
    customerId: 'c2',
    customer: {
      id: 'c2',
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria@correo.com',
      phoneNumber: '87654321',
      address: 'Avenida Siempre Viva 742',
      registrationDate: '2024-10-10T00:00:00Z',
    },
    status: OrderStatus.Confirmed,
    orderDate: new Date().toISOString(),
    items: [],
  },
  {
    id: 3,
    customerId: 'c3',
    customer: {
        id: 'c3',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@correo.com',
        phoneNumber: '12345678',
        address: 'Calle Falsa 123',
        registrationDate: '2024-10-10T00:00:00Z',
    },
    status: OrderStatus.Prepared,
    orderDate: new Date().toISOString(),
    items: [],
    },

];