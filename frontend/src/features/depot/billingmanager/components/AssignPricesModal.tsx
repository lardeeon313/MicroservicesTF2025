import React, { useState } from 'react';
import { DepotOrderDto } from '../types/OrderTypes';
import { setItemUnitPrices } from '../services/OrderService';
import { setItemUnitPricesSchema } from '../validations/orderSchemas';

interface AssignPricesModalProps {
  order: DepotOrderDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignPricesModal: React.FC<AssignPricesModalProps> = ({ order, isOpen, onClose, onSuccess }) => {
  const [prices, setPrices] = useState(order.items.map(item => ({ itemId: item.id, unitPrice: item.unitPrice || 0 })));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (idx: number, value: number) => {
    setPrices(prices => prices.map((p, i) => i === idx ? { ...p, unitPrice: value } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await setItemUnitPricesSchema.validate({
        depotOrderId: order.depotOrderId,
        itemUnitPrices: prices,
      });
      setLoading(true);
      await setItemUnitPrices({
        depotOrderId: order.depotOrderId,
        itemUnitPrices: prices,
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.errors ? err.errors[0] : 'Error al asignar precios.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4 text-red-600">Asignar Precios a Ítems</h3>
        <form onSubmit={handleSubmit}>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">Producto</th>
                <th className="text-left">Marca</th>
                <th className="text-left">Cantidad</th>
                <th className="text-left">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.productBrand}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={prices[idx].unitPrice}
                      onChange={e => handleChange(idx, parseFloat(e.target.value))}
                      className="border rounded px-2 py-1 w-24"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default AssignPricesModal; 