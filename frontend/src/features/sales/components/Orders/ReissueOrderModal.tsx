import React, { useState } from 'react';
import { OrderMissingDto, OrderReissuedRequest } from '../../types/OrderTypes';

interface Props {
  order: OrderMissingDto;
  onClose: () => void;
  onReissue: (data: OrderReissuedRequest) => Promise<void>;
}

const ReissueOrderModal: React.FC<Props> = ({ order, onClose, onReissue }) => {
  const [descriptionResolution, setDescriptionResolution] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descriptionResolution.trim()) {
      alert('La descripción de la resolución es obligatoria.');
      return;
    }

    setIsSubmitting(true);
    const data: OrderReissuedRequest = {
      salesOrderId: order.salesOrderId,
      updateItems: order.salesOrder.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        productBrand: item.productBrand,
        quantity: item.quantity,
      })),
      descriptionResolution,
    };

    try {
      console.log('ReissueOrderModal - handleSubmit data:', data);
      await onReissue(data);
      onClose();
    } catch (error) {
      // El error es manejado por el hook
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Reemitir Orden #{order.salesOrderId}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <p className="mb-4 text-gray-600">
          Esta acción reemitirá la orden, notificará al cliente y actualizará su estado.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de la Resolución
            </label>
            <textarea
              value={descriptionResolution}
              onChange={(e) => setDescriptionResolution(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-700 focus:ring focus:ring-green-700 focus:outline-none"
            ></textarea>
          </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Reemitiendo...' : 'Confirmar Reemisión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReissueOrderModal;