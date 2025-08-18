import { useState, useMemo } from 'react';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import { AssignOrderToOperator } from '../components/AssignOrderToOperator';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import Pagination from '../components/Pagination';
import { fetchPendingOrders } from '../hooks/useOrders';

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
  const [activeTab, setActiveTab] = useState<'pending' | 'assigned' | 'rereceived'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: any) => {
  return {
    
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
    deliveryDate: order.deliveryDate ?? null,
    deliveryDetail: order.deliveryDetail ?? '',
    customerFirstName: order.customerName ? order.customerName.split(' ')[0] : '',
    customerLastName: order.customerName ? order.customerName.split(' ').slice(1).join(' ') : '',
    operatorName: (() => {
      const found = operators.find(op => op.id === order.assignedOperatorId);
      return found?.fullName || '-';
    })(),
    items: Array.isArray(order.items)
      ? order.items.map((item: any) => ({
          productName: item.productName ?? '',
          productBrand: item.productBrand ?? '',
          quantity: item.quantity ?? 0,
        }))
      : [],
    };
  };



  // Filtrar órdenes por estado según la pestaña activa
  const getFilteredOrders = () => {
    if (activeTab === 'pending') {
      // Estado 0: Pendiente
      return orders.filter((order: any) => Number(order.status) === 0);
    } else if (activeTab === 'assigned') {
      // Estado 2: Asignado a Operario
      return orders.filter((order: any) => Number(order.status) === 2);
    } else if (activeTab === 'rereceived') {
      // Estado 1: Re-emitida
      return orders.filter((order: any) => Number(order.status) === 1);
    }
    return [];
  };

  const filteredOrders = getFilteredOrders();
  
  // Paginación
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, itemsPerPage]);
  
  const tableData = paginatedOrders.map(convertToTableData);
  
  // Resetear página cuando cambia la pestaña
  const handleTabChange = (tab: 'pending' | 'assigned' | 'rereceived') => {
    setActiveTab(tab);
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

  // const handleAssignOperator = async (orderId: number, operatorUserId: string) => {
  //   setShowAssignDialog(false);
  //   setSelectedOrder(null);
  // };
  
  if (loading) {
    return <LoadingSpinner message="Cargando órdenes pendientes..." />;
  }

  return (
    <div className="container m-0 pt-10 min-w-full min-h-full py-20 pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Órdenes Pendientes y Asignadas</h1>
              <p className="mt-2 text-gray-600">
                Gestiona las órdenes pendientes de asignación y las ya asignadas a operadores
              </p>
            </div>
            <BackButton to="/depot" />
          </div>
        </div>

        {/* Pestañas */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pendientes de Asignar ({orders.filter((order: any) => Number(order.status) === 0).length})
              </button>
              <button
                onClick={() => handleTabChange('assigned')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Asignadas ({orders.filter((order: any) => Number(order.status) === 2).length})
              </button>
              <button
                onClick={() => handleTabChange('rereceived')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rereceived'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Re-Emitidas ({orders.filter((order: any) => Number(order.status) === 1).length})
              </button>
            </nav>
          </div>
        </div>

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
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'pending'
                ? 'No hay órdenes pendientes de asignar'
                : activeTab === 'assigned'
                ? 'No hay órdenes asignadas'
                : 'No hay órdenes re-emitidas'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'pending'
                ? 'Todas las órdenes han sido asignadas a operadores.'
                : activeTab === 'assigned'
                ? 'No hay órdenes que hayan sido asignadas a operadores.'
                : 'No hay órdenes re-emitidas.'}
            </p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Actualizar
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <OrderTable
              orders={tableData}
              loading={loading}
              error={error}
              onRefetch={refetch}
              onView={handleView}
              activeTab={activeTab}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Detalles de la Orden</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <OrderDetails order={{...convertToTableData(selectedOrder), status:
                  activeTab === 'pending'
                    ? 'Pendiente'
                    : activeTab === 'assigned'
                    ? 'Asignado a Operario'
                    : 'Re-emitida'}} />
                {activeTab === 'pending' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        handleAssign((selectedOrder as any).depotOrderId);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Asignar Operador
                    </button>
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
  );
}

export default PendingOrdersPage;
