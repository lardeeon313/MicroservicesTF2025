import { OrderStatus } from "../features/sales/types/OrderTypes";

export const orderStatusStyles: Record<OrderStatus, { text: string; bg: string }> = {
  [OrderStatus.Pending]: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  [OrderStatus.Issued]: {
    text: "text-blue-700",
    bg: "bg-blue-100",
  },
  [OrderStatus.Confirmed]: {
    text: "text-indigo-700",
    bg: "bg-indigo-100",
  },
  [OrderStatus.InPreparation]: {
    text: "text-purple-700",
    bg: "bg-purple-100",
  },
  [OrderStatus.Prepared]: {
    text: "text-sky-700",
    bg: "bg-sky-100",
  },
  [OrderStatus.Invoiced]: {
    text: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  [OrderStatus.Verify]: {
    text: "text-cyan-700",
    bg: "bg-cyan-100",
  },
  [OrderStatus.OnTheWay]: {
    text: "text-orange-700",
    bg: "bg-orange-100",
  },
  [OrderStatus.Delivered]: {
    text: "text-green-700",
    bg: "bg-green-100",
  },
  [OrderStatus.Canceled]: {
    text: "text-red-700",
    bg: "bg-red-100",
  },
}
