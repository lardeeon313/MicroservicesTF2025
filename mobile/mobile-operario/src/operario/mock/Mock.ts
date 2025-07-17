import { Order } from "../../otherTypes/OrderType";
import { Customer } from "../../otherTypes/CustomerType";
import { OrderStatus } from "../../otherTypes/OrderType";

export const mockCustomer: Customer = {
  id: "0",
  firstName: "Sin",
  lastName: "Cliente",
  email: "n/a@correo.com",
  phoneNumber: "0000000000",
  address: "Dirección desconocida",
  registrationDate: new Date().toISOString(),
};

export const createMockOrder = (id: number): Order => ({
  id,
  status: OrderStatus.InPreparation,
  orderDate: new Date().toISOString(),
  customerId: mockCustomer.id,
  customer: mockCustomer,
  customerFirstName: mockCustomer.firstName,
  customerLastName: mockCustomer.lastName,
  items: [],
});

export default createMockOrder;