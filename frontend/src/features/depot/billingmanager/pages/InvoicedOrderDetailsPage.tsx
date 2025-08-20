
import { useEffect, useState } from 'react';
// Icono de lápiz SVG
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.213-1.213l1-4a4 4 0 01.828-1.414z" />
  </svg>
);
import { useParams } from 'react-router-dom';
import { getInvoicedOrderById, updateInvoicedItemPrice } from '../services/OrderService';
import BackButton from '../components/BackButton';


function InvoicedOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editPrices, setEditPrices] = useState<{ [key: number]: number }>({});
  const [editing, setEditing] = useState(false);
  const [editDisabled, setEditDisabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getInvoicedOrderById(Number(id))
      .then(data => {
        setOrder(data);
        // Inicializar precios editables
        const initialPrices: { [key: number]: number } = {};
        data.items.forEach((item: any) => {
          initialPrices[item.id] = item.unitPrice;
        });
        setEditPrices(initialPrices);
      })
      .catch(() => setError('No se pudo cargar la orden.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEditAll = () => {
    setEditing(true);
  };

  const handlePriceChange = (itemId: number, value: number) => {
    setEditPrices(prev => ({ ...prev, [itemId]: value }));
  };

  const handleSaveAll = async () => {
    if (!order) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      // Lógica para actualizar todos los precios editados
      for (const item of order.items) {
        if (editPrices[item.id] !== item.unitPrice) {
          await updateInvoicedItemPrice({
            billingOrderId: order.depotOrderId,
            itemId: item.id,
            newUnitPrice: editPrices[item.id],
          });
        }
      }
      // Refresca la orden desde backend para tener los datos reales
      const refreshedOrder = await getInvoicedOrderById(Number(order.depotOrderId));
      setOrder(refreshedOrder);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
      setEditing(false);
      setEditDisabled(true); // Deshabilita edición tras guardar
    } catch (err) {
      setSaveError('Error al actualizar los precios.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <BackButton to="/depot/billingmanager/invoiced-orders" />
        <h2 className="text-2xl font-bold text-red-600">Detalle de Orden Facturada</h2>
      </div>
      {loading && <div className="text-center text-lg">Cargando...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && order && (
        <div className="space-y-6 mt-10 w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Cliente:</label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.customerName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Fecha Pedido:</label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{new Date(order.orderDate).toLocaleDateString("es-AR")}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Detalles de entrega:</label>
            <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300">{order.deliveryDetail || "No especificado"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Estado:</label>
            <span className="block w-full rounded-md bg-green-100 px-3 py-1.5 text-base text-green-800 font-semibold">Facturada</span>
          </div>
          <div className="space-y-4 pt-2">
            <div className="overflow-x-auto">
              <table className="table-fixed w-full border-separate">
                <thead>
                  <tr>
                    <th className="w-1/3 text-left px-4 py-2">Producto</th>
                    <th className="w-1/3 text-left px-4 py-2">Marca</th>
                    <th className="w-1/3 text-left px-4 py-2">Cantidad</th>
                    <th className="w-1/3 text-left px-4 py-2">Precio Unitario</th>
                    <th className="w-1/3 text-left px-4 py-2">Subtotal</th>
                    <th className="w-1/3 text-center px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any) => (
                    <tr key={item.id} className="align-top">
                      <td className="pr-2 px-4 py-2">{item.productName}</td>
                      <td className="pr-2 px-4 py-2">{item.productBrand}</td>
                      <td className="pr-2 px-4 py-2">{item.quantity}</td>
                      <td className="pr-2 px-4 py-2">
                        {editing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0.01}
                              step={0.01}
                              value={editPrices[item.id]}
                              onChange={e => handlePriceChange(item.id, parseFloat(e.target.value))}
                              className="border rounded px-2 py-1 w-24 text-right"
                              required
                            />
                            <span className="text-xs text-gray-500">(Actual: {item.unitPrice})</span>
                          </div>
                        ) : (
                          <span>{item.unitPrice}</span>
                        )}
                      </td>
                      <td className="pr-2 px-4 py-2">${((editing ? editPrices[item.id] : item.unitPrice) * item.quantity).toFixed(2)}</td>
                      <td className="pr-2 px-4 py-2 text-center">
                        {/* Acciones */}
                        {!editing && !editDisabled && (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            onClick={handleEditAll}
                            type="button"
                            title="Editar precios"
                          >
                            <PencilIcon />
                          </button>
                        )}
                        {/* Si editDisabled es true, no se muestra el botón de editar */}
                        {editing && (
                          <span className="text-xs text-gray-400">Editando</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editing && (
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold"
                  disabled={saving}
                  onClick={handleSaveAll}
                  type="button"
                >
                  {saving ? 'Guardando...' : 'Guardar precios actualizados'}
                </button>
              </div>
            )}
            <div className="flex justify-end items-center gap-4 mt-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-700">
                ${order.items.reduce((acc: number, i: any) => {
                  const price = editing ? editPrices[i.id] : i.unitPrice;
                  return acc + (isNaN(price) ? 0 : price) * i.quantity;
                }, 0).toFixed(2)}
              </span>
            </div>
            {saveError && <div className="text-red-500 mb-2 text-center">{saveError}</div>}
            {saveSuccess && <div className="text-green-600 mb-2 text-center">Precios actualizados correctamente.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoicedOrderDetailsPage;