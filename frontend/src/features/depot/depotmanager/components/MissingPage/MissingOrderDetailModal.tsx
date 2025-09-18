import { DepotOrderMissingDto, OrderStatus } from "../../types/OrderTypes";
import { X } from "lucide-react";

interface Props {
  order: DepotOrderMissingDto | null;
  onClose: () => void;
  onReport: (order: DepotOrderMissingDto) => void;
}

export default function MissingOrderDetailModal({ order, onClose, onReport }: Props) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Detalle de Orden #{order.depotOrderId}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mb-2 text-slate-700">
          Cliente: {order.depotOrder.customerName}
        </p>
        <p className="mb-4 text-slate-700">
          Faltantes: {order.missingItems.length}
        </p>

        <ul className="space-y-2 mb-6">
          {order.missingItems.map((item, idx) => (
            <li key={idx} className="p-3 border rounded-lg">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-slate-600">
                Marca: {item.productBrand} | Cantidad faltante: {item.missingQuantity}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Cerrar
          </button>
          {order.depotOrder.status === OrderStatus.MissingProduct && (
            <button
              onClick={() => onReport(order)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Reportar a Ventas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
