import { useState } from 'react';
import { getOrderById } from '../services/orderService';
import { DepotOrderEntity } from '../types/OrderTypes';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import { Search, X, Package, User, CalendarDays, BadgeCheck } from 'lucide-react';
import { OrderStatusLabel } from '../constants/OrderStatusLabel';
import toast from 'react-hot-toast';

interface OrderSearchProps {
  onOrderFound?: (order: DepotOrderEntity) => void;
}

export const OrderSearch = ({ onOrderFound }: OrderSearchProps) => {
  const [orderId, setOrderId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<DepotOrderEntity | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast.error('Por favor ingresa un ID de orden');
      return;
    }

    const id = parseInt(orderId.trim());
    if (isNaN(id)) {
      toast.error('El ID de orden debe ser un número válido');
      return;
    }

    try {
      setLoading(true);
      const order = await getOrderById(id);
      setFoundOrder(order);
      setShowDetails(true);
      onOrderFound?.(order);
      toast.success('Orden encontrada');
    } catch (error) {
      console.error('Error searching order:', error);
      toast.error('No se encontró la orden con ese ID');
      setFoundOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOrderId('');
    setFoundOrder(null);
    setShowDetails(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Search className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Buscar Orden</h2>
        </div>
        {foundOrder && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700 mb-2">
            ID de la Orden
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ej: 12345"
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                         disabled:bg-gray-100 disabled:cursor-not-allowed
                         transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white 
                         rounded-lg font-semibold hover:from-red-700 hover:to-red-800 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all shadow-md hover:shadow-lg
                         flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span>{loading ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Vista previa de la orden encontrada */}
      {foundOrder && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-green-600 rounded-lg">
                <Package className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Orden Encontrada</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Package className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</span>
                  <span className="block text-sm font-bold text-gray-900 mt-0.5">V-{foundOrder.depotOrderId}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</span>
                  <span className="block text-sm font-bold text-gray-900 mt-0.5">{foundOrder.customerName}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <BadgeCheck className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</span>
                  <span className="block text-sm font-bold text-gray-900 mt-0.5">
                    {OrderStatusLabel[foundOrder.status as unknown as number] ?? 
                     OrderStatusLabel[foundOrder.status as unknown as string] ?? 
                     String(foundOrder.status)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <CalendarDays className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</span>
                  <span className="block text-sm font-bold text-gray-900 mt-0.5">
                    {new Date(foundOrder.orderDate).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(true)}
            className="w-full px-4 py-2.5 bg-white border-2 border-red-300 text-red-700 
                       rounded-lg font-semibold hover:bg-red-50 hover:border-red-400 
                       transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Package className="h-4 w-4" />
            Ver detalles completos
          </button>
        </div>
      )}

      {/* Modal con detalles completos */}
      {foundOrder && showDetails && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header del modal */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Detalles de la Orden</h2>
                    <p className="text-red-100 text-sm">Orden V-{foundOrder.depotOrderId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenido scrolleable */}
              <div className="overflow-y-auto flex-1 px-8 py-6">
                <OrderDetails 
                  order={{
                    id: foundOrder.depotOrderId,
                    status: OrderStatusLabel[foundOrder.status as unknown as number] ?? 
                            OrderStatusLabel[foundOrder.status as unknown as string] ?? 
                            String(foundOrder.status),
                    orderDate: foundOrder.orderDate.toString(),
                    deliveryDate: undefined,
                    deliveryDetail: foundOrder.deliveryDetail || '',
                    rejectionReason: foundOrder.rejectionReason || '',
                    customerFirstName: foundOrder.customerName.split(' ')[0] || '',
                    customerLastName: foundOrder.customerName.split(' ').slice(1).join(' ') || '',
                    items: foundOrder.items.map((item: any) => ({
                      productName: item.productName,
                      productBrand: item.productBrand,
                      quantity: item.quantity
                    }))
                  }} 
                />
              </div>

              {/* Footer con botón de cerrar */}
              <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white 
                               rounded-lg font-semibold hover:from-red-700 hover:to-red-800 
                               transition-all shadow-md hover:shadow-lg"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};