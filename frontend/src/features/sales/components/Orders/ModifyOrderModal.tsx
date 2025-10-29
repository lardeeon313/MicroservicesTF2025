import React, { useState } from 'react';
import { OrderMissingDto, OrderStatus, UpdateOrderItemRequest, UpdateOrderRequest } from '../../types/OrderTypes';

interface Props {
  order: OrderMissingDto;
  onClose: () => void;
  onSave: (id: number, data: UpdateOrderRequest) => Promise<void>;
}

const ModifyOrderModal: React.FC<Props> = ({ order, onClose, onSave }) => {
  const [deliveryDetail, setDeliveryDetail] = useState(order.salesOrder.deliveryDetail || '');
  const [items, setItems] = useState<UpdateOrderItemRequest[]>(
    order.salesOrder.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productBrand: item.productBrand,
      quantity: item.quantity,
    }))
  );

  const [addressRequest] = useState({
    street: order.salesOrder.deliveryAddress?.street || '',
    number: order.salesOrder.deliveryAddress?.number?.toString() || '',
    apartment: order.salesOrder.deliveryAddress?.apartment || '',
    city: order.salesOrder.deliveryAddress?.city || '',
    province: order.salesOrder.deliveryAddress?.province || '',
    country: order.salesOrder.deliveryAddress?.country || '',
    postalCode: order.salesOrder.deliveryAddress?.postalCode || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemChange = (index: number, field: keyof UpdateOrderItemRequest, value: string | number) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data: UpdateOrderRequest = {
      orderId: order.salesOrderId,
      customerId: order.salesOrder.customerId,
      deliveryDetail,
      items,
      status: OrderStatus.PendingReissued,
      addressRequest,
    };

    try {
      await onSave(order.salesOrderId, data);
      onClose();
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modificar Orden #{order.salesOrderId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Detalle de entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detalle de Entrega</label>
              <textarea
                value={deliveryDetail}
                onChange={(e) => setDeliveryDetail(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-400 focus:outline-none"
              />
            </div>

            {/* Productos */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Productos</h3>
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-4 pb-2 mb-2">
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                    placeholder="Nombre del Producto"
                    className="flex-1 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-red-400"
                  />
                  <input
                    type="text"
                    value={item.productBrand}
                    onChange={(e) => handleItemChange(index, 'productBrand', e.target.value)}
                    placeholder="Marca del Producto"
                    className="flex-1 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-red-400"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10) || 0)}
                    placeholder="Cantidad"
                    className="w-20 px-3 py-2 border rounded-md border-gray-300 focus:border-red-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyOrderModal;
