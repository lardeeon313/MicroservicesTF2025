import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPendingOrderDetails, setItemUnitPrices, invoiceOrder } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import BackButton from '../components/BackButton';

function PendingOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DepotOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState<{ itemId: number; unitPrice: number }[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [facturing, setFacturing] = useState(false);
  const [factureSuccess, setFactureSuccess] = useState(false);
  const [factureError, setFactureError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPendingOrderDetails(Number(id))
      .then(order => {
        setOrder(order);
        setPrices(order.items.map(item => ({ itemId: item.id, unitPrice: item.unitPrice ?? 0 })));
      })
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePriceChange = (idx: number, value: number) => {
    setPrices(prices => prices.map((p, i) => i === idx ? { ...p, unitPrice: value } : p));
  };

  const total = prices.reduce((acc, p, idx) => acc + (p.unitPrice * (order?.items[idx].quantity ?? 0)), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await setItemUnitPrices({
        depotOrderId: order.depotOrderId,
        itemUnitPrices: prices,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    } catch (err) {
      setSaveError('Error al guardar los precios.');
    } finally {
      setSaving(false);
    }
  };

  const handleFacture = async () => {
    if (!order) return;
    setFacturing(true);
    setFactureError(null);
    setFactureSuccess(false);
    try {
      await invoiceOrder(order.depotOrderId);
      setFactureSuccess(true);
      setTimeout(() => navigate('/depot/billingmanager/pending-orders'), 1200);
    } catch (err) {
      setFactureError('Error al facturar la orden.');
    } finally {
      setFacturing(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <BackButton to="/depot/billingmanager/pending-orders" />
        <h2 className="text-2xl font-bold text-red-600">Detalle de Orden Pendiente</h2>
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
                <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">Pendiente de facturar</span>
              </div>
            </div>
          </div>
          {/* Tabla de ítems y formulario */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Producto</th>
                    <th className="px-4 py-2 text-left">Marca</th>
                    <th className="px-4 py-2 text-center">Cantidad</th>
                    <th className="px-4 py-2 text-center">Precio Unitario</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{item.productName}</td>
                      <td className="px-4 py-2">{item.productBrand}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-center">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={prices[idx]?.unitPrice ?? 0}
                          onChange={e => handlePriceChange(idx, parseFloat(e.target.value))}
                          className="border rounded px-2 py-1 w-24 text-right"
                          required
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">${(prices[idx]?.unitPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end items-center gap-4 mt-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-700">${total.toFixed(2)}</span>
            </div>
            {saveError && <div className="text-red-500 mb-2 text-center">{saveError}</div>}
            {saveSuccess && <div className="text-green-600 mb-2 text-center">Precios guardados correctamente.</div>}
            {factureError && <div className="text-red-500 mb-2 text-center">{factureError}</div>}
            {factureSuccess && <div className="text-green-600 mb-2 text-center">Orden facturada correctamente.</div>}
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar precios'}
              </button>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                disabled={facturing}
                onClick={() => setShowConfirm(true)}
              >
                {facturing ? 'Facturando...' : 'Facturar'}
              </button>
            </div>
          </form>
          {/* Modal de confirmación */}
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">¿Confirmar facturación?</h3>
                <p className="mb-6">¿Estás seguro que deseas facturar esta orden? Se guardarán los precios actuales.</p>
                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                    onClick={handleFacture}
                    disabled={facturing}
                  >
                    {facturing ? 'Facturando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PendingOrderDetailsPage; 