import { DepotOrderMissingDto } from "../../types/OrderTypes";
import { Eye, Send } from "lucide-react";

interface Props {
  order: DepotOrderMissingDto;
  onView: (order: DepotOrderMissingDto) => void;
  onReport: (order: DepotOrderMissingDto) => void;
  showReportButton: boolean;
}

export default function MissingOrderCard({
  order,
  onView,
  onReport,
  showReportButton,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">Orden #{order.depotOrderId}</p>
          <h3 className="text-lg font-semibold text-slate-900">
            {order.depotOrder.customerName}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Faltantes: {order.missingItems.length}
          </p>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onView(order)}
          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalle
        </button>
        {showReportButton && (
          <button
            onClick={() => onReport(order)}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Reportar
          </button>
        )}
      </div>
    </div>
  );
}
