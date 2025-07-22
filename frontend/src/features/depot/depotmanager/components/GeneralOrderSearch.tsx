import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/orderService';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderStatusLabel } from '../constants/OrderStatusLabel';

interface GeneralOrderSearchProps {
  onOrderSelected?: (order: DepotOrderDto) => void;
}

const GeneralOrderSearch = ({ onOrderSelected }: GeneralOrderSearchProps) => {
  const [orders, setOrders] = useState<DepotOrderDto[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<DepotOrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Cargar todas las órdenes al montar el componente
  useEffect(() => {
    loadOrders();
  }, []);

  // Filtrar órdenes cuando cambien los filtros
  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        (order as any).depotOrderId?.toString().includes(term) ||
        (order as any).customerName?.toLowerCase().includes(term) ||
        (order as any).deliveryDetail?.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        Number((order as any).status) === parseInt(statusFilter)
      );
    }

    setFilteredOrders(filtered);
  };

  const handleOrderClick = (order: DepotOrderDto) => {
    setSelectedOrder(order);
    setShowDetails(true);
    onOrderSelected?.(order);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Convertir DepotOrderDto a formato compatible con OrderDetails
  const convertToTableData = (order: any) => ({
    id: order.depotOrderId,
    status: OrderStatusLabel[Number(order.status)] ?? 'Desconocido',
    orderDate: order.orderDate ? order.orderDate.toString() : 'Sin fecha',
    deliveryDate: order.deliveryDate ?? undefined,
    deliveryDetail: order.deliveryDetail ?? '',
    customerFirstName: order.customerName ? order.customerName.split(' ')[0] : '',
    customerLastName: order.customerName ? order.customerName.split(' ').slice(1).join(' ') : '',
    items: Array.isArray(order.items) ? order.items.map((item: any) => ({
      productName: item.productName ?? '',
      productBrand: item.productBrand ?? '',
      quantity: item.quantity ?? 0
    })) : []
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Buscar Órdenes</h3>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por ID, Cliente o Dirección
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar órdenes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="0">Emitido</option>
              <option value="2">Asignado</option>
              <option value="3">En Preparación</option>
              <option value="7">Preparado</option>
              <option value="8">Facturado</option>
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter !== 'all') && (
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {filteredOrders.length} de {orders.length} órdenes
            </span>
            <button
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de órdenes */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== 'all' 
            ? 'No se encontraron órdenes con los filtros aplicados'
            : 'No hay órdenes disponibles'
          }
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredOrders.map((order: any) => (
            <div
              key={order.depotOrderId}
              onClick={() => handleOrderClick(order)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">
                      D-{order.depotOrderId}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      Number(order.status) === 0 ? 'bg-blue-100 text-blue-800' :
                      Number(order.status) === 2 ? 'bg-yellow-100 text-yellow-800' :
                      Number(order.status) === 3 ? 'bg-orange-100 text-orange-800' :
                      Number(order.status) === 7 ? 'bg-green-100 text-green-800' :
                      Number(order.status) === 8 ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {OrderStatusLabel[Number(order.status)] ?? 'Desconocido'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customerName}
                  </p>
                  {order.deliveryDetail && (
                    <p className="text-xs text-gray-500 mt-1">
                      {order.deliveryDetail}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Sin fecha'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Array.isArray(order.items) ? order.items.length : 0} productos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal con detalles completos */}
      {selectedOrder && showDetails && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[70]" />
          <div className="fixed inset-0 flex items-center justify-center z-[80]">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Detalles de la Orden D-{(selectedOrder as any).depotOrderId}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <OrderDetails order={convertToTableData(selectedOrder)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralOrderSearch; 