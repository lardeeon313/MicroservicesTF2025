import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/orderService';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { Search, Filter, Package, User, CalendarDays, BadgeCheck, MapPin, CircleDollarSign, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { OrderStatusLabel } from '../constants/OrderStatusLabel';

const statusColors: Record<string | number, string> = {
  0: 'bg-blue-100 text-blue-800 border-blue-300',           // Recibido
  1: 'bg-blue-200 text-blue-800 border-blue-400',           // Re-Recibido
  2: 'bg-yellow-100 text-yellow-800 border-yellow-300',       // Asignado
  3: 'bg-orange-100 text-orange-800 border-orange-300',       // En preparación
  4: 'bg-amber-100 text-amber-800 border-amber-300',         // Notificado falta
  5: 'bg-purple-100 text-purple-800 border-purple-300',       // Enviado a facturar
  6: 'bg-yellow-200 text-yellow-900 border-yellow-400',       // Pendiente de resolución
  7: 'bg-green-100 text-green-800 border-green-300',         // Preparado
  8: 'bg-emerald-100 text-emerald-800 border-emerald-300',     // Facturado
  9: 'bg-blue-100 text-blue-800 border-blue-300',           // Emitido
  10: 'bg-red-100 text-red-800 border-red-300',            // Cancelado
  11: 'bg-gray-200 text-gray-800 border-gray-400',          // Eliminado
  12: 'bg-cyan-100 text-cyan-800 border-cyan-300',          // Verificado
  13: 'bg-yellow-100 text-yellow-800 border-yellow-300',      // En camino
  14: 'bg-green-200 text-green-800 border-green-400',        // Entregado
  15: 'bg-lime-100 text-lime-800 border-lime-300',          // Pendiente de verificación
  16: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',    // Asignado a reparto
  17: 'bg-violet-100 text-violet-800 border-violet-300',      // Pendiente de reparto
  18: 'bg-rose-50 text-rose-700 border-rose-300',           // Pendiente de resolución de incidente
  19: 'bg-green-50 text-green-700 border-green-300',         // Incidente resuelto
};

const getStatusClasses = (status: any) => {
  const key = Number.isNaN(Number(status)) ? status : Number(status);
  return statusColors[key] ?? 'bg-gray-100 text-gray-800 border-gray-300';
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

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
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
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Search className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Buscar Órdenes</h3>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 
                     rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:border-red-500
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Buscar por Nº de Órden, Cliente o Dirección
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar órdenes..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg 
                           focus:outline-none focus:border-red-500
                           transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filtrar por Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg 
                         focus:outline-none focus:border-red-500
                         bg-white cursor-pointer transition-all"
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
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Mostrando {filteredOrders.length} de {orders.length} órdenes
              </span>
            </div>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-semibold 
                         hover:bg-red-50 px-3 py-1 rounded-md transition-colors focus:outline-none focus:border-red-500"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Lista de órdenes */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner message="Cargando órdenes..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron órdenes con los filtros aplicados'
                : 'No hay órdenes disponibles'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredOrders.map((order: any) => (
              <div
                key={order.depotOrderId}
                onClick={() => handleOrderClick(order)}
                className="p-5 border-2 border-gray-200 rounded-xl hover:border-red-400 hover:shadow-md 
                           cursor-pointer transition-all bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900 text-lg">
                        V-{order.depotOrderId}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-lg border-2 ${getStatusClasses(order.status)}`}>
                        {OrderStatusLabel[Number(order.status)] ?? OrderStatusLabel[order.status as string] ?? 'Desconocido'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium">
                        {order.customerName}
                      </p>
                    </div>
                    {order.deliveryDetail && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs line-clamp-1">
                          {order.deliveryDetail}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <CalendarDays className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short'
                        }) : 'Sin fecha'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Package className="h-4 w-4 text-gray-400" />
                      <p className="text-xs text-gray-600 font-medium">
                        {Array.isArray(order.items) ? order.items.length : 0} productos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal con detalles completos */}
      {selectedOrder && showDetails && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[70]" />
          <div className="fixed inset-0 flex items-center justify-center z-[80] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header del modal */}
              <div className={`bg-gradient-to-r px-8 py-6 flex justify-between items-center ${
                Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                  ? 'from-emerald-600 to-emerald-700'
                  : 'from-red-600 to-red-700'
              }`}>
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Detalles de la Orden</h2>
                    <p className={`text-sm ${
                      Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                        ? 'text-emerald-100'
                        : 'text-red-100'
                    }`}>
                      Orden V-{(selectedOrder as any).depotOrderId}
                    </p>
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
                <div className="space-y-8">
                  
                  {/* Sección: Información General */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className={`w-5 h-5 ${
                        Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`} />
                      <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Cliente
                          </label>
                          <p className="text-gray-900 font-medium text-base py-2">
                            {(selectedOrder as any).customerName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Fecha de Pedido
                          </label>
                          <div className="flex items-center gap-2 py-2">
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-900 font-medium text-base">
                              {(selectedOrder as any).orderDate 
                                ? new Date((selectedOrder as any).orderDate).toLocaleDateString("es-AR", {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Sin fecha'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Estado Actual
                          </label>
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm border-2 ${getStatusClasses((selectedOrder as any).status)}`}>
                            <BadgeCheck className="w-4 h-4" />
                            <span>
                              {OrderStatusLabel[Number((selectedOrder as any).status)] ?? 
                              OrderStatusLabel[(selectedOrder as any).status as string] ?? 
                              'Desconocido'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Detalles de Entrega */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className={`w-5 h-5 ${
                        Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`} />
                      <h3 className="text-lg font-semibold text-gray-800">Detalles de Entrega</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Instrucciones Especiales
                        </label>
                        <p className="text-gray-900 text-base leading-relaxed">
                          {(selectedOrder as any).deliveryDetail || "No especificado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sección: Productos */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Package className={`w-5 h-5 ${
                        Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                          ? 'text-emerald-600'
                          : 'text-red-600'
                      }`} />
                      <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Producto
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Marca
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                              Cantidad
                            </th>
                            {Number((selectedOrder as any).status) >= OrderStatus.Invoiced && (
                              <>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Precio Unitario
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                  Subtotal
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {Array.isArray((selectedOrder as any).items) && (selectedOrder as any).items.map((item: any, index: number) => {
                            const rawUnitPrice = item.unitPrice ?? item.price;
                            const derivedUnitPrice = (item.total && item.quantity) ? Number(item.total) / Number(item.quantity || 1) : undefined;
                            const unitPrice = Number(rawUnitPrice ?? derivedUnitPrice ?? 0);
                            const subtotal = Number(item.total ?? unitPrice * Number(item.quantity));

                            return (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-gray-900 font-medium">
                                  {item.productName}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  {item.productBrand}
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
                                    Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {item.quantity}
                                  </span>
                                </td>
                                {Number((selectedOrder as any).status) >= OrderStatus.Invoiced && (
                                  <>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                      {formatMoney(unitPrice)}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
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
                      <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="w-6 h-6 text-emerald-700" />
                            <span className="text-lg font-bold text-gray-800">Total de la Orden:</span>
                          </div>
                          <span className="text-3xl font-bold text-emerald-700">
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
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Footer con botón de cerrar */}
              <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className={`px-6 py-2.5 bg-gradient-to-r text-white rounded-lg font-semibold 
                              transition-all shadow-md hover:shadow-lg ${
                      Number((selectedOrder as any).status) >= OrderStatus.Invoiced
                        ? 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                        : 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                    }`}
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

export default GeneralOrderSearch;