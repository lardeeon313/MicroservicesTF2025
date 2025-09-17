import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvoicedOrderById, updateInvoicedItemPrice } from '../services/OrderService';
import BackButton from '../../../../components/BackButton';
import { AlertCircle, Pencil } from "lucide-react"; // ícono moderno de lápiz
import EmptyState from '../../../../components/EmptyState';
import LoadingSpinner from '../../../../components/LoadingSpinner';

//MEJORAS APLICADAS : 

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

    //Bloquea la accion de modificar otra vez el precio de algun producto de dicho pedido
    const locked = localStorage.getItem(`order-${id}-locked`);
    if (locked === "true") {
      setEditDisabled(true);
    }
    //


    getInvoicedOrderById(Number(id))
      .then(data => {
        setOrder(data);
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
      for (const item of order.items) {
        if (editPrices[item.id] !== item.unitPrice) {
          await updateInvoicedItemPrice({
            billingOrderId: order.depotOrderId,
            itemId: item.id,
            newUnitPrice: editPrices[item.id],
          });
        }
      }
      const refreshedOrder = await getInvoicedOrderById(Number(order.depotOrderId));
      setOrder(refreshedOrder);


      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);


      setEditing(false);
      setEditDisabled(true);

      localStorage.setItem(`order-${order.depotOrderId}-locked`, "true");


    } catch (err) {
      setSaveError('Error al actualizar los precios.');
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot/billingmanager/invoiced-orders" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-4xl font-bold text-red-600 mb-2">Detalle de Orden Facturada</h2>
          <p className="text-center text-lg text-gray-700 mb-12">
            Aquí puedes ver los detalles de una orden que ya ha sido facturada.
          </p>


          {loading && <LoadingSpinner message='Cargando orden...' height='400'/>}

          {error && (
            <EmptyState
              icon={AlertCircle}
              title="Error al cargar la orden"
              description="Intenta recargar la página o volver más tarde."
            />
          )}

          {!loading && !error && order && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
              {/* Datos del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                  <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">{order.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                  <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">{new Date(order.orderDate).toLocaleDateString("es-AR")}</p>
                </div>
                <div className='md:col-span-2'>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de entrega:</label>
                  <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">{order.deliveryDetail || "No especificado"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-4">Estado:</label>
                  <span className="rounded-lg border border-gray-300 bg-green-100 px-3 py-2.5 font-semibold text-gray-900 shadow-sm">Facturado</span>
                </div>
              </div>

              {/* Tabla de productos */}
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3">Marca</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Precio Unitario</th>
                      <th className="px-4 py-3">Subtotal</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">{item.productName}</td>
                        <td className="px-4 py-3">{item.productBrand}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">
                          {editing ? (
                            <input
                              type="number"
                              min={0.01}
                              step={0.01}
                              value={editPrices[item.id]}
                              onChange={e => handlePriceChange(item.id, parseFloat(e.target.value))}
                              className="border border-gray-300 rounded-md px-2 py-1 w-28 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              required
                            />
                          ) : (
                            <span className="font-medium text-gray-800">{item.unitPrice}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          ${(editing ? editPrices[item.id] : item.unitPrice) * item.quantity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {!editing && !editDisabled && (
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md transition"
                              onClick={handleEditAll}
                              type="button"
                              title="Editar precios"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                          )}
                          {editing && (
                            <span className="text-xs text-gray-500 italic">Editando...</span>
                          )}
                          {/* Mensaje de bloqueo */}
                          {editDisabled && (
                            <div className="text-center text-sm text-gray-700 bg-yellow-100 border border-yellow-300 rounded-md py-2 mb-4">
                              ⚠️ Solo se puede modificar esta orden una vez. No se pueden volver a editar los precios.
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botón de guardar */}
              {editing && (
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-bold transition"
                    disabled={saving}
                    onClick={handleSaveAll}
                    type="button"
                  >
                    {saving ? 'Guardando...' : 'Guardar precios actualizados'}
                  </button>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-end items-center gap-4 mt-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-700">
                  ${order.items.reduce((acc: number, i: any) => {
                    const price = editing ? editPrices[i.id] : i.unitPrice;
                    return acc + (isNaN(price) ? 0 : price) * i.quantity;
                  }, 0).toFixed(2)}
                </span>
              </div>

              {/* Mensajes */}
              {saveError && <div className="text-red-500 mb-2 text-center">{saveError}</div>}
              {saveSuccess && <div className="text-green-600 mb-2 text-center">Precios actualizados correctamente.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoicedOrderDetailsPage;
