import { OrderStatus } from "../../otherTypes/OrderType";
import type { Order } from "../../otherTypes/OrderType";
import type { OrderItem } from "../../otherTypes/OrderType";


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
    items: [
      {
        id:1,
        orderId:2,
        productName:"Garbanzo",
        productBrand:"Lata",
        quantity:3,
        packaging:"Empaquetado",
        unitPrice:23,
        total:200
      }
    ],
  },
  {
    id: 2,
    customerId: '2',
    customer: {
      id: '1',
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria@correo.com',
      phoneNumber: '87654321',
      address: 'Avenida Siempre Viva 742',
      registrationDate: '2024-10-10T00:00:00Z',
    },
    status: OrderStatus.Confirmed,
    orderDate: new Date().toISOString(),
    items: [
      {
        id:1,
        orderId:2,
        productName:"Garbanzo",
        productBrand:"Lata",
        quantity:3,
        packaging:"Empaquetado",
        unitPrice:23,
        total:200
      }
    ],
  },
  {
    id: 3,
    customerId: '3',
    customer: {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@correo.com',
        phoneNumber: '12345678',
        address: 'Calle Falsa 123',
        registrationDate: '2024-10-10T00:00:00Z',
    },
    status: OrderStatus.Prepared,
    orderDate: new Date().toISOString(),
    items: [
      {
        id:1,
        orderId:3,
        productName:"Garbanzo",
        productBrand:"Lata",
        quantity:3,
        packaging:"Empaquetado",
        unitPrice:23,
        total:200
      }
    ],
  },{
    id:4,
    customerId: '4',
    customer: {
      id: '1',
      firstName: 'Jose',
      lastName: 'Guitierrez',
      email: 'cliente@prep.com',
      phoneNumber: '999999999',
      address: 'Dirección Genérica 999',
      registrationDate: new Date().toISOString(),
    },
    status: OrderStatus.InPreparation,
    orderDate: new Date().toISOString(),
    items: [
      {
        id: 1,
        orderId: 999,
        productName: 'Aceite de Girasol',
        productBrand: 'Natura',
        quantity: 4,
        packaging: 'Caja x12',
        unitPrice: 1300,
        total: 5200,
      },
    ],
  }

];
