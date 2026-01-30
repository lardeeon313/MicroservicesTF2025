import { useState, useMemo } from 'react';
import { DepotOrderDto, OrderStatus } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import { AssignOrderToOperator } from '../components/AssignOrderToOperator';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../../../../components/BackButton';
import Pagination from '../components/Pagination';
import { fetchPendingOrders } from '../hooks/useOrders';
import OrderTabs from '../../../../components/OrderTabs';
import EmptyState from '../../../../components/EmptyState';
import { BadgeCheck, Box, CalendarDays, MapPin, Package, User } from 'lucide-react';

function PendingOrdersPage() {
  const {
    orders,
    operators,
    loading,
    error,
    refetch,
    refetchOrders
  } = fetchPendingOrders();

  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>(
    OrderStatus.Received
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: DepotOrderDto) => ({
    id: order.depotOrderId,
    status:
      Number(order.status) === 0
        ? 'Pendiente'
        : Number(order.status) === 2
        ? 'Asignado a Operario'
        : Number(order.status) === 1
        ? 'Re-emitida'
        : 'Otro',
    orderDate: order.orderDate ? order.orderDate.toString() : 'Sin fecha',
    deliveryDate: order.deliveryDate ? order.deliveryDate.toString() : undefined,
    // Aquí nos aseguramos de que siempre sea string
    deliveryDetail: order.deliveryDetail != null ? order.deliveryDetail : '',
    customerFirstName: order.customerName?.split(' ')[0] || '',
    customerLastName: order.customerName?.split(' ').slice(1).join(' ') || '',
    operatorName: (() => {
      const found = operators.find(op => op.id === order.assignedOperatorId);
      return found?.fullName || '-';
    })(),
    address: order.address
      ? {
          id: order.address.id,
          street: order.address.street,
          number: order.address.number,
          apartment: order.address.apartment,
          city: order.address.city,
          province: order.address.province,
          country: order.address.country,
          postalCode: order.address.postalCode,
          latitude: order.address.latitude,
          longitude: order.address.longitude,
          formattedAddress: order.address.formattedAddress
        }
      : undefined,
    items: Array.isArray(order.items)
      ? order.items.map(item => ({
          productName: item.productName ?? '',
          productBrand: item.productBrand ?? '',
          quantity: item.quantity ?? 0
        }))
      : []
  });

  // Filtrar órdenes por estado según la pestaña activa
  const filteredOrders = orders.filter(
    (order: any) => Number(order.status) === activeStatus
  );
  
  // Paginación
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);
  
  const tableData = paginatedOrders.map(convertToTableData);
  

  // Resetear página cuando cambia la pestaña
  const handleTabChange = (status: OrderStatus) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handleView = (id: number) => {
    const order = filteredOrders.find(o => (o as any).depotOrderId === id);
    setSelectedOrder(order || null);
  };

  const handleAssign = (id: number) => {
    const order = filteredOrders.find(o => (o as any).depotOrderId === id);
    if (order) {
      setSelectedOrder(order);
      setShowAssignDialog(true);
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando órdenes pendientes..." height='h-screen' />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full">
      <div className="container mx-auto py-10 px-16 sm:max-w-8xl">
        <BackButton to="/depot" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold text-red-600 mb-2">Órdenes Pendientes y Asignadas</h1>
          <p className="text-center text-lg text-gray-700 mb-12">
            Gestiona las órdenes pendientes de asignación y las ya asignadas a operadores
          </p>


          {/* ✅ Tabs reutilizando OrderTabs */}
          <OrderTabs
            activeStatus={activeStatus}
            onChange={handleTabChange}
            tabs={[
              {
                status: OrderStatus.Received,
                label: "Pendientes de Asignar",
                count: orders.filter(
                  (order: any) => Number(order.status) === OrderStatus.Received
                ).length,
              },
              {
                status: OrderStatus.Assigned,
                label: "Asignadas",
                count: orders.filter(
                  (order: any) => Number(order.status) === OrderStatus.Assigned
                ).length,
              },
              {
                status: OrderStatus.ReReceived,
                label: "Re-Emitidas",
                count: orders.filter(
                  (order: any) => Number(order.status) === OrderStatus.ReReceived
                ).length,
              },
            ]}
          />

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={() => refetchOrders()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 ? (
            <EmptyState
              icon={Box}
              title={
                activeStatus === OrderStatus.Received
                  ? "No hay órdenes pendientes de asignar"
                  : activeStatus === OrderStatus.Assigned
                  ? "No hay órdenes asignadas"
                  : "No hay órdenes re-emitidas"
              }
              description={
                activeStatus === OrderStatus.Received
                  ? "Todas las órdenes han sido asignadas a operadores."
                  : activeStatus === OrderStatus.Assigned
                  ? "No hay órdenes que hayan sido asignadas a operadores."
                  : "No hay órdenes re-emitidas."
              }
              actionLabel="Actualizar"
              onAction={refetch}
            />
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <OrderTable
                orders={tableData}
                loading={loading}
                error={error}
                onRefetch={refetch}
                onView={handleView}
                  activeTab={
                  activeStatus === OrderStatus.Received
                    ? "pending"
                    : activeStatus === OrderStatus.Assigned
                    ? "assigned"
                    : "rereceived"
                }
              />
              
              {!loading && !error && filteredOrders.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  totalItems={filteredOrders.length}
                  itemsPerPage={itemsPerPage}
                />
              )}
            </div>
          )}

          {/* Diálogo de detalles de orden */}
          {selectedOrder && !showAssignDialog && (
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
                        <p className="text-red-100 text-sm">Orden V-{(selectedOrder as any).depotOrderId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido scrolleable */}
                  <div className="overflow-y-auto flex-1 px-8 py-6">
                    <div className="space-y-8">
                      
                      {/* Sección: Información General */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-red-600" />
                          <h3 className="text-lg font-semibold text-gray-800">Información General</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className='py-2'>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Cliente
                              </label>
                              <p className="text-gray-900 font-medium text-base">
                                {selectedOrder.customerName}
                              </p>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Fecha de Pedido
                              </label>
                              <div className="flex items-center gap-2 py-2">
                                <CalendarDays className="w-4 h-4 text-gray-400" />
                                <p className="text-gray-900 font-medium text-base">
                                  {selectedOrder.orderDate 
                                    ? new Date(selectedOrder.orderDate).toLocaleDateString("es-AR", {
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
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm transition-all duration-200 hover:shadow-md">
                                  <BadgeCheck className="w-4 h-4 opacity-80" />
                                  <span className={`
                                    ${activeStatus === OrderStatus.Received
                                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-300 rounded-full px-3 py-1 text-sm leading-none'
                                      : activeStatus === OrderStatus.Assigned
                                      ? 'bg-blue-50 text-blue-700 border border-blue-300 rounded-full px-3 py-1 text-sm leading-none'
                                      : 'bg-orange-50 text-orange-700 border border-orange-300 rounded-full px-3 py-1 text-sm leading-none'}
                                  `}>
                                    {activeStatus === OrderStatus.Received
                                      ? 'Pendiente'
                                      : activeStatus === OrderStatus.Assigned
                                      ? 'Asignado a Operario'
                                      : 'Re-emitida'}
                                  </span>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sección: Detalles de Entrega */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <MapPin className="w-5 h-5 text-red-600" />
                          <h3 className="text-lg font-semibold text-gray-800">Detalles de Entrega</h3>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Dirección de Entrega
                              </label>
                              <p className="text-gray-900 text-base leading-relaxed">
                                {selectedOrder.address
                                  ? `${selectedOrder.address.street} ${selectedOrder.address.number}${
                                      selectedOrder.address.apartment ? `, ${selectedOrder.address.apartment}` : ''
                                    }, ${selectedOrder.address.city}, ${selectedOrder.address.province}`
                                  : 'No especificado'}
                              </p>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Instrucciones Especiales
                              </label>
                              <p className="text-gray-900 text-base leading-relaxed">
                                {selectedOrder.deliveryDetail || "No especificado"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sección: Productos */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="w-5 h-5 text-red-600" />
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
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {selectedOrder.items.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 text-gray-900 font-medium">
                                    {item.productName}
                                  </td>
                                  <td className="px-6 py-4 text-gray-700">
                                    {item.productBrand}
                                  </td>
                                  <td className="px-6 py-4 text-gray-700">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                                      {item.quantity}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Footer con botones */}
                  {(activeStatus === OrderStatus.Received || activeStatus === OrderStatus.ReReceived) && (
                    <div className="border-t border-gray-200 px-8 py-5 bg-gray-50">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold 
                                    hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                        >
                          Cerrar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            handleAssign((selectedOrder as any).depotOrderId);
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold 
                                    hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg
                                    flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Asignar Operador
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </>
          )}

          {/* Diálogo de asignar operador */}
          {showAssignDialog && selectedOrder && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <AssignOrderToOperator
                  orderId={(selectedOrder as any).depotOrderId}
                  operators={operators}
                  onAssignSuccess={() => {
                    setShowAssignDialog(false);
                    setSelectedOrder(null);
                    refetchOrders();
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setShowAssignDialog(false);
                      setSelectedOrder(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingOrdersPage;
