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
import { Box } from 'lucide-react';

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
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-red-600">Detalles de la Orden</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
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
                        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Pedido:</label>
                        <p className="rounded-md bg-gray-50 px-3 py-2 text-gray-900 shadow-sm">
                          {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString("es-AR") : 'Sin fecha'}
                        </p>
                      </div>
                      <div className='md:col-span-2'>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Detalles de entrega:</label>
                        <p className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900 shadow-sm">
                          {selectedOrder.deliveryDetail || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-4">Estado:</label>
                        <span className={`rounded-lg border border-gray-300 px-3 py-2.5 font-semibold text-gray-900 shadow-sm ${
                          activeStatus === OrderStatus.Received
                            ? 'bg-yellow-100'
                            : activeStatus === OrderStatus.Assigned
                            ? 'bg-blue-100'
                            : 'bg-orange-100'
                        }`}>
                          {activeStatus === OrderStatus.Received
                            ? 'Pendiente'
                            : activeStatus === OrderStatus.Assigned
                            ? 'Asignado a Operario'
                            : 'Re-emitida'}
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
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.items.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3">{item.productName}</td>
                              <td className="px-4 py-3">{item.productBrand}</td>
                              <td className="px-4 py-3">{item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Botón de asignar operador */}
                    {(activeStatus === OrderStatus.Received || activeStatus === OrderStatus.ReReceived) && (
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            handleAssign((selectedOrder as any).depotOrderId);
                          }}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg shadow font-bold transition hover:bg-red-700"
                        >
                          Asignar Operador
                        </button>
                      </div>
                    )}
                  </div>
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