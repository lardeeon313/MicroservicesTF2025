import React from "react";
//import { OrderStatus } from "../features/depot/billingmanager/types/OrderTypes";

interface OrderDetailsCardProps {
  customerName: string;
  orderDate: string | Date;
  deliveryDetail?: string;
  status?: number | string;
}

// Map de labels
const OrderStatusLabels: { [key: number]: string } = {
  0: "Recibido",
  1: "Re-Recibido",
  2: "Asignado",
  3: "En preparación",
  4: "Falta de producto",
  5: "Pendiente de facturación",
  6: "Pendiente de resolución",
  7: "Preparado",
  8: "Facturado",
  9: "Emitido por ventas",
  10: "Cancelado",
  11: "Eliminado",
};

// Map de colores
const OrderStatusColors: { [key: number]: string } = {
  0: "bg-blue-100 text-blue-800",
  1: "bg-blue-200 text-blue-900",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-purple-100 text-purple-800",
  4: "bg-red-100 text-red-800",
  5: "bg-indigo-100 text-indigo-800",
  6: "bg-orange-100 text-orange-800",
  7: "bg-green-100 text-green-800",
  8: "bg-green-200 text-green-900",
  9: "bg-teal-100 text-teal-800",
  10: "bg-gray-200 text-gray-800",
  11: "bg-gray-300 text-gray-700",
};

// 👇 Agrega este objeto aquí
const OrderStatusStringToNumber: { [key: string]: number } = {
  "Recibido": 0,
  "Re-Recibido": 1,
  "Asignado": 2,
  "En Preparación": 3,
  "Falta de producto": 4,
  "Pendiente de facturación": 5,
  "Pendiente de resolución": 6,
  "Preparado": 7,
  "Facturado": 8,
  "Emitido por ventas": 9,
  "Cancelado": 10,
  "Eliminado": 11,
};


const OrderDetailsInformation: React.FC<OrderDetailsCardProps> = ({
  customerName,
  orderDate,
  deliveryDetail,
  status,
}) => {
    // Convertir `status` a número
  let statusNum: number | undefined;

  if (typeof status === "number") {
    statusNum = status;
  } else if (typeof status === "string") {
    // Si es un string, buscar su valor numérico en el mapeo
    statusNum = OrderStatusStringToNumber[status];
  } else if (status !== undefined) {
    // Si es un valor del enum OrderStatus
    statusNum = status;
  }

  // Obtener el label y el color
  const label = statusNum !== undefined && OrderStatusLabels[statusNum]
    ? OrderStatusLabels[statusNum]
    : "Sin estado";

  const colorClass = statusNum !== undefined && OrderStatusColors[statusNum]
    ? OrderStatusColors[statusNum]
    : "bg-gray-100 text-gray-800";

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Cliente:
        </label>
        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
          {customerName}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Fecha Pedido:
        </label>
        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
          {new Date(orderDate).toLocaleDateString("es-AR")}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Detalles de entrega:
        </label>
        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
          {deliveryDetail || "No especificado"}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Estado:
        </label>
        <span
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 ${colorClass}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default OrderDetailsInformation;
