import { DepotOrderMissingDto } from "../../types/OrderTypes";

interface Props {
  open: boolean;
  order: DepotOrderMissingDto | null;
  onCancel: () => void;
  onConfirm: () => void;
}

function ReportConfirmModal({ open, order, onCancel, onConfirm }: Props) {
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Confirmar Reporte
        </h3>
        <p className="text-slate-700 mb-6">
          ¿Seguro que deseas reportar la orden #{order.depotOrderId} a ventas?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportConfirmModal;