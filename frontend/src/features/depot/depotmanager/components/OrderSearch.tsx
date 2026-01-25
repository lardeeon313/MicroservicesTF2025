import { useState } from 'react';
import { getOrderById } from '../services/orderService';
import { DepotOrderEntity } from '../types/OrderTypes';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import { Search, X } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Buscar Orden</h2>
        {foundOrder && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
            ID de la Orden
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ej: 12345"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>{loading ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Mostrar detalles de la orden encontrada */}
      {foundOrder && showDetails && (
        <div className="mt-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Orden Encontrada</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 font-medium">D-{foundOrder.depotOrderId}</span>
              </div>
              <div>
                <span className="text-gray-500">Cliente:</span>
                <span className="ml-2 font-medium">{foundOrder.customerName}</span>
              </div>
              <div>
                <span className="text-gray-500">Estado:</span>
                <span className="ml-2 font-medium">
                  {OrderStatusLabel[foundOrder.status as unknown as number] ?? OrderStatusLabel[foundOrder.status as unknown as string] ?? String(foundOrder.status)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Fecha:</span>
                <span className="ml-2 font-medium">
                  {new Date(foundOrder.orderDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            {showDetails ? 'Ocultar detalles' : 'Ver detalles completos'}
          </button>
        </div>
      )}

      {/* Modal con detalles completos */}
      {foundOrder && showDetails && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detalles de la Orden D-{foundOrder.depotOrderId}</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Convertir DepotOrderEntity a formato compatible con OrderDetails */}
              <OrderDetails 
                order={{
                  id: foundOrder.depotOrderId,
                  status: OrderStatusLabel[foundOrder.status as unknown as number] ?? OrderStatusLabel[foundOrder.status as unknown as string] ?? String(foundOrder.status),
                  orderDate: foundOrder.orderDate.toString(),
                  deliveryDate: undefined, // DepotOrderEntity no tiene DeliveryDate
                  deliveryDetail: foundOrder.deliveryDetail || '',
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
          </div>
        </>
      )}
    </div>
  );
}; 