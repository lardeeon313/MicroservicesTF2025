import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPendingOrderDetails, setItemUnitPrices, invoiceOrder, getPendingBillingOrders } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import BackButton from '../../../../components/BackButton';



function PendingOrderDetailsPage() {
  const [hasSavedPrices, setHasSavedPrices] = useState(false);
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

  const location = useLocation() as { state?: { order?: DepotOrderDto | null } };

  useEffect(() => {
    if (!id) return;
    // Si viene por estado desde la tabla, úsalo primero
    if (location.state?.order) {
      const o = location.state.order;
      setOrder(o);
      setPrices(o.items.map(item => ({ itemId: item.id, unitPrice: item.unitPrice ?? 0 })));
      setLoading(false);
      return;
    }
    setLoading(true);
    getPendingOrderDetails(Number(id))
      .then(order => {
        setOrder(order);
        setPrices(order.items.map(item => ({ itemId: item.id, unitPrice: item.unitPrice ?? 0 })));
      })
      .catch(async () => {
        // Fallback: cargar todas y filtrar
        try {
          const all = await getPendingBillingOrders();
          const found = all.find(o => o.depotOrderId === Number(id)) || null;
          if (found) {
            setOrder(found);
            setPrices(found.items.map(item => ({ itemId: item.id, unitPrice: item.unitPrice ?? 0 })));
          } else {
            setError('No se pudo cargar la orden.');
          }
        } catch {
          setError('No se pudo cargar la orden.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePriceChange = (idx: number, value: number) => {
    setPrices(prices => prices.map((p, i) => i === idx ? { ...p, unitPrice: value } : p));
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    // Validar precios antes de enviar
    for (const p of prices) {
      if (!Number.isFinite(p.unitPrice) || p.unitPrice <= 0) {
        setSaveError('Todos los precios deben ser números válidos y mayores a 0.');
        return;
      }
    }
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await setItemUnitPrices({
        depotOrderId: order.depotOrderId,
        itemUnitPrices: prices,
      });
      setSaveSuccess(true);
      setHasSavedPrices(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    } catch (err) {
      setSaveError('Error al guardar los precios.');
    } finally {
      setSaving(false);
    }
  };

  const handleFacture = async () => {
    if (!order) return;
    // Validar precios antes de facturar
    for (const p of prices) {
      if (!Number.isFinite(p.unitPrice) || p.unitPrice <= 0) {
        setFactureError('Todos los precios deben ser números válidos y mayores a 0.');
        return;
      }
    }
    if (!hasSavedPrices) {
      setFactureError('Debes guardar los precios antes de facturar.');
      return;
    }
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
        <div className="space-y-6 mt-10 w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente:</label>
            <p className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm">{order.customerName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Pedido:</label>
            <p className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm">{new Date(order.orderDate).toLocaleDateString("es-AR")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detalles de entrega:</label>
            <p className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm">{order.deliveryDetail || "No especificado"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
            <p className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 shadow-sm">Pendiente de facturar</p>
          </div>
          <div className="space-y-6 pt-4">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Tabla de productos */}
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="table-fixed w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="w-1/3 text-left px-4 py-3 font-semibold text-gray-700">Producto</th>
                        <th className="w-1/3 text-left px-4 py-3 font-semibold text-gray-700">Marca</th>
                        <th className="w-1/3 text-left px-4 py-3 font-semibold text-gray-700">Cantidad</th>
                        <th className="w-1/3 text-left px-4 py-3 font-semibold text-gray-700">Precio Unitario</th>
                        <th className="w-1/3 text-left px-4 py-3 font-semibold text-gray-700">Subtotal</th>
                      </tr>
                    </thead>
                  <tbody>
                {order.items.map((item, idx) => (
                <tr
                  key={item.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 py-3">{item.productName}</td>
                  <td className="px-4 py-3">{item.productBrand}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                        min={0.01}
                        step={0.01}
                        value={prices[idx]?.unitPrice === 0 ? '' : prices[idx]?.unitPrice}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          handlePriceChange(idx, val);
                          setHasSavedPrices(false);
                        }}
                        className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
                             rounded-md px-2 py-1 w-28 text-right shadow-sm outline-none transition"
                        required
                      />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {prices[idx]?.unitPrice > 0
                      ? `$${(prices[idx].unitPrice * item.quantity).toFixed(2)}`
                      : '-'}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end items-center gap-4 mt-6 border-t pt-4">
            <span className="text-lg font-semibold text-gray-700">Total:</span>
            <span className="text-2xl font-bold text-green-700">
            {prices.every(p => Number.isFinite(p.unitPrice) && p.unitPrice > 0)
              ? `$${prices
                .reduce(
                  (acc, p, idx) =>
                    acc + p.unitPrice * (order?.items[idx].quantity ?? 0),
                  0
                )
                .toFixed(2)}`
              : '-'}
            </span>
          </div>

          {/* Mensajes de estado */}
          {!hasSavedPrices && (
            <div className="text-yellow-600 bg-yellow-100 px-4 py-2 rounded-md shadow-sm text-center">
              Recuerda guardar los precios antes de facturar.
            </div>
          )}
          {saveError && (
            <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-sm text-center">
              {saveError}
            </div>
          )}
          {saveSuccess && (
          <div className="text-green-600 bg-green-100 px-4 py-2 rounded-md shadow-sm text-center">
            Precios guardados correctamente.
          </div>
          )}
          {factureError && (
          <div className="text-red-600 bg-red-100 px-4 py-2 rounded-md shadow-sm text-center">
            {factureError}
          </div>
          )}
          {factureSuccess && (
          <div className="text-green-600 bg-green-100 px-4 py-2 rounded-md shadow-sm text-center">
            Orden facturada correctamente.
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:scale-95
                   text-white px-6 py-2 rounded-lg shadow-md 
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
          >
          {saving ? 'Guardando...' : 'Guardar precios'}
          </button>
          <button
            type="button"
              className="bg-green-600 hover:bg-green-700 active:scale-95
                   text-white px-6 py-2 rounded-lg shadow-md 
                   transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={facturing}
            onClick={() => setShowConfirm(true)}
          >
            {facturing ? 'Facturando...' : 'Facturar'}
          </button>
        </div>
      </form>
    </div>

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