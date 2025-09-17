import React from 'react';
import { OrderMissingDto } from '../../types/OrderTypes';
import formatDate from '../../../../utils/formateDate';
import { OrderStatusBadge } from '../../../../components/OrderStatusBadge';

interface Props {
  order: OrderMissingDto;
  onClose: () => void;
  onModify: () => void;
  onReissue: () => void;
  onCancel: () => void;
  statusFilter: string;
}

const OrderDetailsModal: React.FC<Props> = ({ order, onClose, onModify, onReissue, onCancel, statusFilter }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Detalles del Faltante #{order.missingId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Información de la Orden</h3>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Venta ID:</span> V-{order.salesOrderId}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Estado:</span> <OrderStatusBadge status={order.salesOrder.status}></OrderStatusBadge></p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Cliente:</span> {order.salesOrder.customerFirstName} {order.salesOrder.customerLastName}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Fecha de Pedido:</span> {formatDate(order.salesOrder.orderDate)}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Detalle de Entrega:</span> {order.salesOrder.deliveryDetail || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Información del Faltante</h3>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Faltante ID:</span> {order.missingId}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Motivo:</span> {order.missingReason || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Descripción:</span> {order.missingDescription || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Fecha del Reporte:</span> {formatDate(order.missingDate)}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Productos Faltantes</h3>
            <table className="w-full text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad Faltante</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.missingItems?.length > 0 ? order.missingItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{item.productName || 'N/A'}</td>
                    <td className="px-4 py-3">{item.productBrand || 'N/A'}</td>
                    <td className="px-4 py-3 font-medium">{item.missingQuantity || 0}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center text-gray-500">No hay productos faltantes registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {statusFilter === 'PendingResolution' && (
              <>
                <button
                  onClick={onModify}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Modificar
                </button>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar Orden
                </button>
              </>
            )}
            {statusFilter === 'PendingReissued' && (
              <button
                onClick={onReissue}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Reemitir
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;