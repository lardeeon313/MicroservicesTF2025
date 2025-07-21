import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoicedOrderById, updateInvoicedItemPrice } from '../services/OrderService';
import BackButton from '../components/BackButton';

function InvoicedOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getInvoicedOrderById(Number(id))
      .then(setOrder)
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditPrice(order.items[idx].unitPrice ?? 0);
  };

  const handleSave = async (itemId: number) => {
    if (!order) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await updateInvoicedItemPrice({
        billingOrderId: order.depotOrderId,
        itemId,
        newUnitPrice: editPrice,
      });
      // Actualiza el mock/local
      const updatedOrder = { ...order };
      updatedOrder.items = updatedOrder.items.map((item: any, idx: number) =>
        idx === editIdx ? { ...item, unitPrice: editPrice, total: editPrice * item.quantity, wasEdited: true } : item
      );
      updatedOrder.wasModified = true;
      updatedOrder.totalAmount = updatedOrder.items.reduce((acc: number, i: any) => acc + (i.unitPrice ?? 0) * i.quantity, 0);
      setOrder(updatedOrder);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
      setEditIdx(null);
    } catch (err) {
      setSaveError('Error al actualizar el precio.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <BackButton to="/depot/billingmanager" />
        <h2 className="text-2xl font-bold text-blue-700">Detalle de Orden Facturada</h2>
      </div>
      {loading && <div className="text-center text-lg">Cargando...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && order && (
        <div>
          {/* Card de datos principales */}
          <div className="bg-white rounded-lg shadow p-6 mb-8 border">
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[180px]">
                <div className="text-xs text-gray-500">Cliente</div>
                <div className="font-semibold text-base">{order.customerName}</div>
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-base">{order.customerEmail}</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-xs text-gray-500">Teléfono</div>
                <div className="text-base">{order.phoneNumber}</div>
              </div>
              <div className="flex-1 min-w-[180px]">
                <div className="text-xs text-gray-500">Dirección</div>
                <div className="text-base">{order.deliveryDetail}</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-xs text-gray-500">Fecha Pedido</div>
                <div className="text-base">{new Date(order.orderDate).toLocaleDateString()}</div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-xs text-gray-500">Estado</div>
                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">Facturada{order.wasModified ? ' (Modificada)' : ''}</span>
              </div>
            </div>
          </div>
          {/* Tabla de ítems */}
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Producto</th>
                  <th className="px-4 py-2 text-left">Marca</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  <th className="px-4 py-2 text-center">Precio Unitario</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, idx: number) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.productName}</td>
                    <td className="px-4 py-2">{item.productBrand}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-center">
                      {editIdx === idx ? (
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={editPrice}
                          onChange={e => setEditPrice(parseFloat(e.target.value))}
                          className="border rounded px-2 py-1 w-24 text-right"
                          required
                          disabled={item.wasEdited}
                        />
                      ) : (
                        <span>{item.unitPrice}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">
                      {item.wasEdited ? (
                        <span className="text-xs text-gray-400">Editado</span>
                      ) : (
                        editIdx === idx ? (
                          <>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2"
                              disabled={saving}
                              onClick={() => handleSave(item.id)}
                              type="button"
                            >
                              {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                              onClick={() => setEditIdx(null)}
                              type="button"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            onClick={() => handleEdit(idx)}
                            type="button"
                          >
                            Editar
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center gap-4 mt-4">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-green-700">${order.items.reduce((acc: number, i: any) => acc + (i.unitPrice ?? 0) * i.quantity, 0).toFixed(2)}</span>
          </div>
          {saveError && <div className="text-red-500 mb-2 text-center">{saveError}</div>}
          {saveSuccess && <div className="text-green-600 mb-2 text-center">Precio actualizado correctamente.</div>}
        </div>
      )}
    </div>
  );
}

export default InvoicedOrderDetailsPage; 