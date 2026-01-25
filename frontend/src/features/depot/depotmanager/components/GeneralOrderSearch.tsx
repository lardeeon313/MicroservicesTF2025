import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/orderService';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderStatusLabel } from '../constants/OrderStatusLabel';

const statusColors: Record<string | number, string> = {
  0: 'bg-blue-100 text-blue-800',           // Recibido
  1: 'bg-blue-200 text-blue-800',           // Re-Recibido
  2: 'bg-yellow-100 text-yellow-800',       // Asignado
  3: 'bg-orange-100 text-orange-800',       // En preparación
  4: 'bg-amber-100 text-amber-800',         // Notificado falta
  5: 'bg-purple-100 text-purple-800',       // Enviado a facturar
  6: 'bg-yellow-200 text-yellow-900',       // Pendiente de resolución
  7: 'bg-green-100 text-green-800',         // Preparado
  8: 'bg-emerald-100 text-emerald-800',     // Facturado
  9: 'bg-blue-100 text-blue-800',           // Emitido
  10: 'bg-red-100 text-red-800',            // Cancelado
  11: 'bg-gray-200 text-gray-800',          // Eliminado
  12: 'bg-cyan-100 text-cyan-800',          // Verificado
  13: 'bg-yellow-100 text-yellow-800',      // En camino
  14: 'bg-green-200 text-green-800',        // Entregado
  15: 'bg-lime-100 text-lime-800',          // Pendiente de verificación
  16: 'bg-fuchsia-100 text-fuchsia-800',    // Asignado a reparto
  17: 'bg-violet-100 text-violet-800',      // Pendiente de reparto
  18: 'bg-rose-50 text-rose-700',           // Pendiente de resolución de incidente
  19: 'bg-green-50 text-green-700',         // Incidente resuelto
};

const getStatusClasses = (status: any) => {
  const key = Number.isNaN(Number(status)) ? status : Number(status);
  return statusColors[key] ?? 'bg-gray-100 text-gray-800';
};

const formatMoney = (value: number) =>
  `$${Number(value || 0).toFixed(2)}`;

interface GeneralOrderSearchProps {
  // onOrderSelected?: (order: DepotOrderDto) => void; // Comentado temporalmente
}

const GeneralOrderSearch = ({}: GeneralOrderSearchProps) => {
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

  // Debug: Log cuando cambie el estado del modal
  useEffect(() => {
    console.log('Modal state changed:', { selectedOrder: !!selectedOrder, showDetails });
  }, [selectedOrder, showDetails]);

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
    console.log('Order clicked:', order);
    setSelectedOrder(order);
    setShowDetails(true);
    // No llamamos onOrderSelected aquí para evitar que se cierre el modal
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };


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
              <option value="9">Emitido</option>
              <option value="2">Asignado</option>
              <option value="3">En preparación</option>
              <option value="4">Notificado falta</option>
              <option value="5">Enviado a facturar</option>
              <option value="6">Pendiente de resolución</option>
              <option value="7">Preparado</option>
              <option value="8">Facturado</option>
              <option value="12">Verificado</option>
              <option value="13">En camino</option>
              <option value="14">Entregado</option>
              <option value="15">Pendiente de verificación</option>
              <option value="16">Asignado a reparto</option>
              <option value="17">Pendiente de reparto</option>
              <option value="18">Pendiente de resolución de incidente</option>
              <option value="19">Incidente resuelto</option>
              <option value="10">Cancelado</option>
              <option value="11">Eliminado</option>
              <option value="0">Recibido</option>
              <option value="1">Re-Recibido</option>
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
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(order.status)}`}>
                      {OrderStatusLabel[Number(order.status)] ?? OrderStatusLabel[order.status as string] ?? 'Desconocido'}
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-600">
                  Detalles de la Orden D-{(selectedOrder as any).depotOrderId}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 space-y-10">
                {/* Datos del cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cliente:</label>
                    <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                      {(selectedOrder as any).customerName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                    <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                      {(selectedOrder as any).orderDate ? new Date((selectedOrder as any).orderDate).toLocaleDateString("es-AR") : 'Sin fecha'}
                    </p>
                  </div>
                  <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de entrega:</label>
                    <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                      {(selectedOrder as any).deliveryDetail || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-4">Estado:</label>
                    <span className={`rounded-lg border border-gray-300 px-3 py-2.5 font-semibold text-gray-900 shadow-sm ${getStatusClasses((selectedOrder as any).status)}`}>
                      {OrderStatusLabel[Number((selectedOrder as any).status)] ?? OrderStatusLabel[(selectedOrder as any).status as string] ?? 'Desconocido'}
                    </span>
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
                        {Number((selectedOrder as any).status) >= OrderStatus.Invoiced && (
                          <>
                            <th className="px-4 py-3">Precio Unitario</th>
                            <th className="px-4 py-3">Subtotal</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Array.isArray((selectedOrder as any).items) && (selectedOrder as any).items.map((item: any, index: number) => {
                          // Derivar precio unitario aunque no venga explícito
                          const rawUnitPrice = item.unitPrice ?? item.price;
                          const derivedUnitPrice = (item.total && item.quantity) ? Number(item.total) / Number(item.quantity || 1) : undefined;
                          const unitPrice = Number(rawUnitPrice ?? derivedUnitPrice ?? 0);

                          const subtotal = Number(item.total ?? unitPrice * Number(item.quantity));

                          return (
                            <tr key={index} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3">{item.productName}</td>
                              <td className="px-4 py-3">{item.productBrand}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                              {Number((selectedOrder as any).status) >= OrderStatus.Invoiced && (
                                <>
                                  <td className="px-4 py-3 font-medium text-gray-800">
                                    {formatMoney(unitPrice)}
                                  </td>
                                  <td className="px-4 py-3 font-semibold text-gray-900">
                                    {formatMoney(subtotal)}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* Total - Solo para órdenes facturadas */}
                {Number((selectedOrder as any).status) >= OrderStatus.Invoiced && (
                  <div className="flex justify-end items-center gap-4 mt-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-700">
                      {formatMoney(
                        Array.isArray((selectedOrder as any).items)
                          ? (selectedOrder as any).items.reduce((acc: number, item: any) => {
                              const unitPrice = item.unitPrice ?? item.price ?? 0;
                              const subtotal = item.total ?? unitPrice * item.quantity;
                              return acc + subtotal;
                            }, 0)
                          : 0
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralOrderSearch; 