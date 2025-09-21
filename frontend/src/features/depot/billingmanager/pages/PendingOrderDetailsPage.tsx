import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPendingOrderDetails, setItemUnitPrices, invoiceOrder, getPendingBillingOrders } from '../services/OrderService';
import { DepotOrderDto } from '../types/OrderTypes';
import BackButton from '../../../../components/BackButton';
import BillingOrderTable from '../components/BillingOrderTable';



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
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/pending-orders" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">
            Detalle de Orden Pendiente
          </h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Revisa y gestiona la orden seleccionada antes de facturar.
          </p>

          {/* Loader y error */}
          {loading && (
            <div className="text-center text-lg text-gray-600 mt-10">
              Cargando...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 mt-10">{error}</div>
          )}

          {!loading && !error && order && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
              {/* Datos del pedido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">{order.customerName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">{new Date(order.orderDate).toLocaleDateString("es-AR")}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de Entrega:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">{order.deliveryDetail || "No especificado"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 font-semibold text-gray-900 shadow-sm">Pendiente de facturar</p>
                </div>

              </div>

              {/* Tabla de productos */}
              <BillingOrderTable
                items={order.items}
                prices={prices}
                onPriceChange={handlePriceChange}
                onSave={handleSave}
                onFacture={() => setShowConfirm(true)}
                saving={saving}
                facturing={facturing}
                hasSavedPrices={hasSavedPrices}
                saveError={saveError}
                saveSuccess={saveSuccess}
                factureError={factureError}
                factureSuccess={factureSuccess}
              />
  
            </div>
          )}

          {/* Modal de confirmación */}
          {showConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">
                  ¿Confirmar facturación?
                </h3>
                <p className="mb-6">
                  ¿Estás seguro que deseas facturar esta orden? Se guardarán los
                  precios actuales.
                </p>
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
                    {facturing ? "Facturando..." : "Confirmar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrderDetailsPage; 