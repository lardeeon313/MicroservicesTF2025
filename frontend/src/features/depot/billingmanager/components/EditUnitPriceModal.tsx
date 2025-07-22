import React, { useState } from 'react';
import { updateInvoicedItemPrice } from '../services/OrderService';
import { updateInvoicedItemPriceSchema } from '../validations/orderSchemas';

interface EditUnitPriceModalProps {
  orderId: number;
  item: {
    Id: number;
    ProductName: string;
    ProductBrand: string;
    UnitPrice?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditUnitPriceModal: React.FC<EditUnitPriceModalProps> = ({ orderId, item, isOpen, onClose, onSuccess }) => {
  const [unitPrice, setUnitPrice] = useState(item.UnitPrice || 0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateInvoicedItemPriceSchema.validate({
        BillingOrderId: orderId,
        ItemId: item.Id,
        NewUnitPrice: unitPrice,
      });
      setLoading(true);
      await updateInvoicedItemPrice({
        billingOrderId: orderId,
        itemId: item.Id,
        newUnitPrice: unitPrice,
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.errors ? err.errors[0] : 'Error al actualizar el precio.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-red-600">Editar Precio Unitario</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <div className="font-semibold">{item.ProductName} ({item.ProductBrand})</div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={unitPrice}
              onChange={e => setUnitPrice(parseFloat(e.target.value))}
              className="border rounded px-2 py-1 w-32"
              required
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUnitPriceModal; 