// mocks/mockMissingItems.ts
import { Missing } from "../types/Missing";
import type { Order } from "../../otherTypes/OrderType";

export const getMockMissingItems = (order: Order): Missing[] => [
  {
    id: 1,
    product: {
      id: 1,
      orderId: order.id,
      productName: "Harina 000",
      productBrand: "Molinos",
      quantity: 2,
      packaging: "Bolsa",
      unitPrice: 1200,
      total: 2400,
    },
    notifyMissing: (description: string) => ({
      missingDate: new Date(),
      missingTimeUtc: new Date(),
      description,
    }),
  },
  {
    id: 2,
    product: {
      id: 2,
      orderId: order.id,
      productName: "Aceite",
      productBrand: "Cocinero",
      quantity: 1,
      packaging: "Botella",
      unitPrice: 1800,
      total: 1800,
    },
    notifyMissing: (description: string) => ({
      missingDate: new Date(),
      missingTimeUtc: new Date(),
      description,
    }),
  },
];


