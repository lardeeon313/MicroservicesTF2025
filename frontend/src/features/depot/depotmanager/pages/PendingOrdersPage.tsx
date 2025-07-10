import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { DepotOrderDto } from '../types/OrderTypes';
import OrderTable from '../../billingmanager/components/OrderTable';
import OrderDetails from '../../billingmanager/components/OrderDetails';
import AssignOrderToOperator from '../components/AssignOrderToOperator';
import LoadingSpinner from '../../../../components/LoadingSpinner';

function PendingOrdersPage() {
  const {
    pendingOrders,
    operators,
    loading,
    error,
    assignOperatorToOrder,
    refetch
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState<DepotOrderDto | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Convertir DepotOrderDto a OrderTableData para compatibilidad
  const convertToTableData = (order: DepotOrderDto) => ({
    id: order.DepotOrderId,
    status: order.Status,
    orderDate: order.OrderDate.toString(),
    deliveryDetail: order.DeliveryDetail,
    customerFirstName: order.CustomerName.split(' ')[0] || '',
    customerLastName: order.CustomerName.split(' ').slice(1).join(' ') || '',
    items: order.Items.map(item => ({
      productName: item.ProductName,
      productBrand: item.ProductBrand,
      quantity: item.Quantity
    }))
  });

  const tableData = pendingOrders.map(convertToTableData);

  const handleView = (id: number) => {
    const order = pendingOrders.find(o => o.DepotOrderId === id);
    setSelectedOrder(order || null);
  };

  const handleAssign = (id: number) => {
    const order = pendingOrders.find(o => o.DepotOrderId === id);
    if (order) {
      setSelectedOrder(order);
      setShowAssignDialog(true);
    }
  };

  const handleAssignOperator = async (orderId: number, operatorUserId: string) => {
    await assignOperatorToOrder(orderId, operatorUserId);
    setShowAssignDialog(false);
    setSelectedOrder(null);
  };

  const handleActionChange = (action: string, id: number) => {
    switch (action) {
      case 'asignar':
        handleAssign(id);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando órdenes pendientes..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Órdenes Pendientes de Asignación</h1>
          <p className="mt-2 text-gray-600">
            Asigna operadores a las órdenes emitidas desde ventas
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <OrderTable
          orders={tableData}
          loading={loading}
          error={error}
          onRefetch={refetch}
          onView={handleView}
          showEditButton={false}
          showDeleteButton={false}
          customActions={[
            { label: 'Asignar Operador', value: 'asignar' }
          ]}
          onActionChange={handleActionChange}
        />

        {/* Diálogo de detalles de orden */}
        {selectedOrder && !showAssignDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <OrderDetails order={convertToTableData(selectedOrder)} />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    handleAssign(selectedOrder.DepotOrderId);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Asignar Operador
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diálogo de asignar operador */}
        {showAssignDialog && selectedOrder && (
          <AssignOrderToOperator
            order={selectedOrder}
            operators={operators}
            onAssign={handleAssignOperator}
            onClose={() => {
              setShowAssignDialog(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default PendingOrdersPage;
