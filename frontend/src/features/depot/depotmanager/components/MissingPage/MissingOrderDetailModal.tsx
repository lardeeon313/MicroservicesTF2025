import { DepotOrderMissingDto, OrderStatus } from "../../types/OrderTypes";
import { AlertCircle, BadgeCheck, Package, User, X } from "lucide-react";

interface Props {
  order: DepotOrderMissingDto | null;
  onClose: () => void;
  onReport: (order: DepotOrderMissingDto) => void;
}

export default function MissingOrderDetailModal({ order, onClose, onReport }: Props) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header del modal */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Detalle de la Orden</h2>
              <p className="text-red-100 text-sm">Orden V-{order.depotOrderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          <div className="space-y-8">
            
            {/* Sección: Información General */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800">Información del Cliente</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Cliente
                    </label>
                    <p className="text-gray-900 font-medium text-base">
                      {order.depotOrder.customerName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Productos Faltantes
                    </label>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm bg-red-100 text-red-800 border-2 border-red-300">
                      <BadgeCheck className="w-4 h-4" />
                      <span>{order.missingItems.length} {order.missingItems.length === 1 ? 'producto' : 'productos'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Productos Faltantes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800">Productos Faltantes</h3>
              </div>
              <div className="space-y-3">
                {order.missingItems.map((item, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-base mb-2">
                          {item.productName}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Marca:</span>
                            <span className="text-gray-700 font-medium">{item.productBrand}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Cantidad Faltante:</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-sm">
                              {item.missingQuantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold 
                        hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
            >
              Cerrar
            </button>
            {order.depotOrder.status === OrderStatus.MissingProduct && (
              <button
                onClick={() => onReport(order)}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold 
                          hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg
                          flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Reportar a Ventas
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
